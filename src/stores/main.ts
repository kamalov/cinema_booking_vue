// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import {groupBy, sortBy} from 'lodash'
import dayjs from 'dayjs'

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
  id: number;
  name: string;
  address: string;
}

interface ISession {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
}

interface ISessionsByMovie {
  movie_id: number;
  sessions: Array<{
    date: string,
    sessions_by_cinema: Array<{
      cinema_id: number,
      sessions: Array<ISession>
    }>
  }>
}

interface IMainStoreData {
  token: string | null,
  movies: Map<number, IMovie> | null
  cinemas: Map<number, ICinema> | null
  sessions_by_movie: ISessionsByMovie | null
}

export const useMainStore = defineStore('main', () => {
  const data = reactive<IMainStoreData>({
    token: null,
    movies: null,
    cinemas: null,
    sessions_by_movie: null
  })

  const http_get = async (url: string) => {
    const request = {
      method: 'GET',
      headers: { Authorization: `Bearer ${data.token}` },
    }
    const response = await fetch(url, request)
    return await response.json()
  }

  const http_post = async (url: string, params: never) => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(params),
    }
    const response = await fetch(url, request)
    return await response.json()
  }

  const load_initial_data = async () => {
    let movies = (await http_get('/api/movies')) as IMovie[]
    data.movies = new Map(movies.map((movie) => [movie.id, movie]))

    let cinemas = (await http_get('/api/cinemas')) as ICinema[]
    data.cinemas = new Map(cinemas.map((cinema) => [cinema.id, cinema]))
  }

  const get_sessions_by_movie = async (movie_id: number) => {
    data.sessions_by_movie = null;

    let sessions: ISession[] = await http_get(`/api/movies/${movie_id}/sessions`);
    let by_date_groups = groupBy(sessions, session => {
      let date = new Date(session.startTime);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    let sessions_by_movie: ISessionsByMovie = { movie_id, sessions: []};
    for (const [date, sessions] of Object.entries(by_date_groups)) {
      let seance: ISessionsByMovie["sessions"][number] = { date, sessions_by_cinema: []}
      const by_cinema_groups = groupBy(sessions, session => session.cinemaId);
      for (let [cinema_id, sessions] of Object.entries(by_cinema_groups)) {
        sessions = sortBy(sessions, session => session.startTime);
        let cinema: (typeof seance)["sessions_by_cinema"][number] = {
          cinema_id: Number(cinema_id),
          sessions
        };
        seance.sessions_by_cinema.push(cinema);
      }
      seance.sessions_by_cinema = sortBy(seance.sessions_by_cinema, cinema_sessions => cinema_sessions.cinema_id);
      sessions_by_movie.sessions.push(seance);
    }
    sessions_by_movie.sessions = sortBy(sessions_by_movie.sessions, seance => seance.date);

    data.sessions_by_movie = sessions_by_movie;
  }

  return { data, load_initial_data, get_sessions_by_movie }
})

export {type IMovie, type ISessionsByMovie}
