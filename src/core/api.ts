import { FetchResponse, fetchWithErrorHandling } from '@/lib/fetch';
import { API_ENDPOINTS } from '@/lib/endpoint';

export async function analyze(data: object): Promise<FetchResponse> {
  return await fetchWithErrorHandling(API_ENDPOINTS.analyze, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function research(data: object): Promise<FetchResponse> {
  return await fetchWithErrorHandling(API_ENDPOINTS.research, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function ideation(data: object): Promise<FetchResponse> {
  return await fetchWithErrorHandling(API_ENDPOINTS.ideation, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function generate(data: object): Promise<FetchResponse> {
  return await fetchWithErrorHandling(API_ENDPOINTS.generate, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function edit(data: object): Promise<FetchResponse> {
  return await fetchWithErrorHandling(API_ENDPOINTS.edit, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
