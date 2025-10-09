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
        async fetchChunkStrategies(apiBase: string) {
            this.status = 'pending'
            this.error = null
            // Fetch the actual data
            try {
                console.log('Fetching chunking strats from store', apiBase)
                const response = await fetch(`${apiBase}/knowledge/chunk-strategies`);
                
                if (!response.ok) {
                    throw new Error(`Error fetching chunk strategies: ${response.statusText}`);
                }
                console.log('Response ok, parsing json {}', response)

                const data = await response.json()

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