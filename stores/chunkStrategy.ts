import { defineStore } from 'pinia'
import type { ChunkStrategy } from '../shared/types/chunkStrategy'


export const useChunkStrategyStore = defineStore('chunkStrategies',{
    state: () => {
        return {
            count: 0,
            status: 'idle' as 'idle' | 'pending' | 'error' | 'success',
            chunkingStrategies: [] as ChunkStrategy[],
            error: null as null | any
        }
    },

    actions: {
        async fetchStragegies(apiBase: string) {
            this.status = 'pending'
            this.error = null
            // Fetch the actual data
            try {
                console.log('Fetching chunking strats from store', apiBase)
                const { data, error, status } = await useFetch(`${apiBase}/knowledge/chunk-strategies`);
                if (error.value) throw error.value

                this.chunkingStrategies = data.strategies
                this.status = 'success'
                console.log('Fetched chunking strats', this.chunkingStrategies)
            } catch (err) {
                this.error = err
                this.status = 'error'
            }
        }
    }
})