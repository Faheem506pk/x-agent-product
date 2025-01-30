import config from '@/lib/config';

interface FetchOptions extends RequestInit {
    headers?: HeadersInit
}

export interface FetchResponse {
    message?: string
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: any
}
const { API_URL } = config;

export async function fetchWithErrorHandling(
    endpoint: string,
    options: FetchOptions = {}
): Promise<FetchResponse> {
    try {
        const config: FetchOptions = {
            ...options,
        }

        const responseBody: FetchResponse = {}
        const response = await fetch(`${API_URL}${endpoint}`, config)

        responseBody.status = response.status
        responseBody.message = response.statusText
        responseBody.ok = response.ok

        responseBody.data = await response.json()
        return responseBody
    } catch (error) {
        console.error(error)

        const responseBody: FetchResponse = {}

        responseBody.status = 500
        responseBody.message = "unknown"
        responseBody.ok = false
        return responseBody
    }
}
