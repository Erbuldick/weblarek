type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        if (!baseUrl) {
            throw new Error('API baseUrl не задан. Проверьте переменные окружения (VITE_API_ORIGIN).');
        }
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            },
            cache: 'no-cache'
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) {
            return response.json();
        } else {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => Promise.reject(data.error ?? response.statusText));
            } else {
                return response.text().then(text => Promise.reject(text || response.statusText));
            }
        }
    }

    get<T extends object>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse<T>);
    }

    post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse<T>);
    }
}