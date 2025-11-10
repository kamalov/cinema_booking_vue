import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { notify } from "@kyvg/vue3-notification";
import { groupBy, sortBy } from 'lodash'
import dayjs from 'dayjs'

/// types

interface ISettings {
  bookingPaymentTimeSeconds: number
}

interface IMovie {
  id: number
  title: string
  year: number
  rating: number
  posterImage: string
  lengthMinutes: number
  description: string
}

interface ICinema {
  id: number
  name: string
  address: string
}

interface ISession {
  id: number
  movieId: number
  cinemaId: number
  startTime: string
}

interface ISessionsByMovie {
  movie_id: number
  sessions: Array<{
    date: string
    sessions_by_cinema: Array<{
      cinema_id: number
      sessions: Array<ISession>
    }>
  }>
}

interface ISessionsByCinema {
  cinema_id: number
  sessions: Array<{
    date: string
    sessions_by_movie: Array<{
      movie_id: number
      sessions: Array<ISession>
    }>
  }>
}

interface ISeat {
  rowNumber: number
  seatNumber: number
}

interface ISessionInfo {
  id: number
  movieId: number
  cinemaId: number
  startTime: string
  seats: {
    rows: number
    seatsPerRow: number
  }
  bookedSeats: ISeat[]
  selected_seats: Set<string>
  booked_seats: Set<string>
}

interface IBooking {
  id: string
  movieSessionId: number
  userId: number
  isPaid: boolean
  seats: ISeat[]
  bookedAt: string
  session_start_time: string
}

interface IMainStoreData {
  settings: ISettings | null
  movies: Map<number, IMovie> | null
  cinemas: Map<number, ICinema> | null
  sessions: Map<number, ISession>
  sessions_by_movie: ISessionsByMovie | null
  sessions_by_cinema: ISessionsByCinema | null
  session_info: ISessionInfo | null
  my_bookings: IBooking[] | null
}

interface IFetchResult {
  message?: string,
  error?: string
}

/// store

const useMainStore = defineStore('main', () => {
  const data = reactive<IMainStoreData>({
    settings: null,
    movies: null,
    cinemas: null,
    sessions: new Map<number, ISession>(),
    sessions_by_movie: null,
    sessions_by_cinema: null,
    session_info: null,
    my_bookings: null,
  })

  const token_ref = ref('')
  const user_authorized = computed(() => Boolean(token_ref.value));

  const set_token = (new_token: string) => {
    localStorage['token'] = new_token
    token_ref.value = new_token
  }

  const http_get = async <T>(url: string): Promise<T> => {
    const request = {
      method: 'GET',
      headers: { Authorization: `Bearer ${token_ref.value}` },
    }
    const response = await fetch(url, request)
    const result = await response.json()
    if (response.ok) {
      return result as T
    } else {
      notify({
        type: 'error',
        text: result.message || result.error,
      })
      return null as T
    }
  }

  const http_post = async <T>(url: string, params: any): Promise<T> => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token_ref.value}`,
      },
      body: JSON.stringify(params),
    }
    const response = await fetch(url, request)
    const result = await response.json()
    if (response.ok) {
      return result as T
    } else {
      notify({
        type: 'error',
        text: result.message || result.error,
      })
      return null as T
    }
  }

  const load_initial_data = async () => {
    const [settings, movies, cinemas] = await Promise.all([
      http_get<ISettings>('/api/settings'),
      http_get<IMovie[]>('/api/movies'),
      http_get<ICinema[]>('/api/cinemas'),
    ])

    data.settings = settings
    data.movies = new Map(movies.map((movie) => [movie.id, movie]))
    data.cinemas = new Map(cinemas.map((cinema) => [cinema.id, cinema]))

    set_token(localStorage['token'] ?? '')
  }

  const register_new_user = async (username: string, password: string) => {
    const response = await http_post<any>('/api/register', { username, password })
    if (response) {
      set_token(response.token)
    }
  }

  const login_user = async (username: string, password: string) => {
    const response = await http_post<any>('/api/login', { username, password })
    if (response) {
      set_token(response.token)
    }
  }

  const logout = () => {
    set_token('')
  }

  const get_sessions_by_movie = async (movie_id: number) => {
    data.sessions_by_movie = null

    let sessions: ISession[] = await http_get(`/api/movies/${movie_id}/sessions`)

    for (const session of sessions) {
      data.sessions.set(session.id, session)
    }

    sessions = sortBy(sessions, ['startTime', 'cinemaId'])

    let by_date_groups = groupBy(sessions, (session) =>
      dayjs(session.startTime).startOf('day').toISOString(),
    )

    let sessions_by_movie: ISessionsByMovie = { movie_id, sessions: [] }
    for (const [date, sessions] of Object.entries(by_date_groups)) {
      let seance: ISessionsByMovie['sessions'][number] = { date, sessions_by_cinema: [] }
      const by_cinema_groups = groupBy(sessions, (session) => session.cinemaId)
      for (let [cinema_id, sessions] of Object.entries(by_cinema_groups)) {
        let cinema: (typeof seance)['sessions_by_cinema'][number] = {
          cinema_id: Number(cinema_id),
          sessions,
        }
        seance.sessions_by_cinema.push(cinema)
      }
      sessions_by_movie.sessions.push(seance)
    }

    data.sessions_by_movie = sessions_by_movie
  }

  const get_sessions_by_cinema = async (cinema_id: number) => {
    data.sessions_by_cinema = null

    let sessions: ISession[] = await http_get(`/api/cinemas/${cinema_id}/sessions`)

    for (const session of sessions) {
      data.sessions.set(session.id, session)
    }

    sessions = sortBy(sessions, ['startTime', 'movieId'])

    let by_date_groups = groupBy(sessions, (session) =>
      dayjs(session.startTime).startOf('day').toISOString(),
    )

    let sessions_by_cinema: ISessionsByCinema = { cinema_id, sessions: [] }
    for (const [date, sessions] of Object.entries(by_date_groups)) {
      let seance: ISessionsByCinema['sessions'][number] = { date, sessions_by_movie: [] }
      const by_movie_groups = groupBy(sessions, (session) => session.movieId)
      for (let [movie_id, sessions] of Object.entries(by_movie_groups)) {
        let cinema: (typeof seance)['sessions_by_movie'][number] = {
          movie_id: Number(movie_id),
          sessions,
        }
        seance.sessions_by_movie.push(cinema)
      }
      sessions_by_cinema.sessions.push(seance)
    }

    data.sessions_by_cinema = sessions_by_cinema
  }

  const get_session_info = async (session_id: number) => {
    data.session_info = null
    const session_info = (await http_get(`/api/movieSessions/${session_id}`)) as ISessionInfo
    session_info.selected_seats = new Set()
    session_info.booked_seats = new Set(
      session_info.bookedSeats.map((seat) => JSON.stringify(seat)),
    )
    data.session_info = session_info
  }

  const book_selected_seats = async () => {
    const seats = [...data.session_info!.selected_seats].map((seat_str) => JSON.parse(seat_str))
    await http_post(`/api/movieSessions/${data.session_info!.id}/bookings`, {
      seats,
    })
    void get_session_info(data.session_info!.id)
  }

  const get_my_bookings = async () => {
    data.my_bookings = null
    let bookings = (await http_get('/api/me/bookings')) as IBooking[]
    for (const booking of bookings) {
      booking.seats = sortBy(booking.seats, ['rowNumber', 'seatNumber']);
    }
    const session_ids = bookings.map((booking) => booking.movieSessionId)
    const missing_session_ids = session_ids.filter((session_id) => !data.sessions.has(session_id))
    if (missing_session_ids.length > 0) {
      const queries = missing_session_ids.map((session_id) =>
        http_get<ISessionInfo>(`/api/movieSessions/${session_id}`),
      )
      const sessions = await Promise.all(queries)
      for (const session of sessions) {
        const { id, movieId, cinemaId, startTime } = session
        data.sessions.set(session.id, { id, movieId, cinemaId, startTime })
      }
    }
    for (const booking of bookings) {
      booking.session_start_time = data.sessions!.get(booking.movieSessionId)!.startTime;
    }
    bookings = sortBy(bookings, ['session_start_time'])
    data.my_bookings = bookings
  }

  const pay_for_booking = async (bookingId: string) => {
    const result = await http_post<IFetchResult>(`/api/bookings/${bookingId}/payments`, { bookingId });
    notify({
      type: 'success',
      text: result.message,
    })
    void get_my_bookings()
  }

  return {
    user_authorized,
    data,
    load_initial_data,
    get_sessions_by_movie,
    get_sessions_by_cinema,
    get_session_info,
    get_my_bookings,
    book_selected_seats,
    pay_for_booking,
    register_new_user,
    login_user,
    logout
  }
})

export { useMainStore, type IMovie, type ISessionsByMovie, type ISessionInfo, type ICinema, type IBooking, type ISessionsByCinema }
