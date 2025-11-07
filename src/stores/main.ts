// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { groupBy, sortBy } from 'lodash'
import dayjs from 'dayjs'

/// types

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
}

interface IMainStoreData {
  movies: Map<number, IMovie> | null
  cinemas: Map<number, ICinema> | null
  sessions_by_movie: ISessionsByMovie | null
  session_info: ISessionInfo | null
  bookings: IBooking[] | null
}

/// store

const useMainStore = defineStore('main', () => {
  const data = reactive<IMainStoreData>({
    movies: null,
    cinemas: null,
    sessions_by_movie: null,
    session_info: null,
    bookings: null,
  })

  const token = ref('')
  const user_authorized = computed(() => Boolean(token.value))

  const http_get = async (url: string) => {
    const request = {
      method: 'GET',
      headers: { Authorization: `Bearer ${token.value}` },
    }
    const response = await fetch(url, request)
    return await response.json()
  }

  const http_post = async (url: string, params: any) => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(params),
    }
    const response = await fetch(url, request)
    return await response.json()
  }

  const register_new_user = async (username: string, password: string) => {
    token.value = await http_post('/api/register', { username, password })
  }

  const login_user = async (username: string, password: string) => {
    const response = await http_post('/api/login', { username, password })
    token.value = response.token
  }

  const load_initial_data = async () => {
    let movies = (await http_get('/api/movies')) as IMovie[]
    data.movies = new Map(movies.map((movie) => [movie.id, movie]))

    let cinemas = (await http_get('/api/cinemas')) as ICinema[]
    data.cinemas = new Map(cinemas.map((cinema) => [cinema.id, cinema]))

    await register_new_user('test', 'test')
    await login_user('test', 'test')
  }

  const get_sessions_by_movie = async (movie_id: number) => {
    data.sessions_by_movie = null

    let sessions: ISession[] = await http_get(`/api/movies/${movie_id}/sessions`)
    sessions = sortBy(sessions, ['startTime', 'cinema_id'])
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

  const get_session_info = async (session_id: number) => {
    data.session_info = null
    const session_info = (await http_get(`/api/movieSessions/${session_id}`)) as ISessionInfo
    session_info.selected_seats = new Set()
    session_info.booked_seats = new Set(
      session_info.bookedSeats.map((seat) => JSON.stringify(seat)),
    )
    data.session_info = session_info
  }

  const get_bookings = async () => {
    data.bookings = (await http_get('/api/me/bookings')) as IBooking[]
  }

  const book_selected_seats = async () => {
    const seats = [...data.session_info!.selected_seats].map((seat_str) => JSON.parse(seat_str))
    await http_post(`/api/movieSessions/${data.session_info!.id}/bookings`, {
      seats,
    })
    void get_session_info(data.session_info!.id);
  }

  return {
    user_authorized,
    data,
    load_initial_data,
    get_sessions_by_movie,
    get_session_info,
    get_bookings,
    book_selected_seats,
  }
})

export { useMainStore, type IMovie, type ISessionsByMovie, type ISessionInfo, type ICinema }
