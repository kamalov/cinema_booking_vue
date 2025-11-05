// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

interface IMovie {
  id: number
  title: string
  year: number
  rating: number
  posterImage: string
  lengthMinutes: number
  description: string
}

interface IMainStoreData {
  token: string | null,
  movies: Map<number, IMovie> | null
}

export const useMainStore = defineStore('main', () => {
  const data = reactive<IMainStoreData>({
    token: null,
    movies: null,
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

  const get_movies = async () => {
    let movies = (await http_get('/api/movies')) as IMovie[]
    data.movies = new Map(movies.map((movie) => [movie.id, movie]))
  }

  return { data, get_movies }
})
