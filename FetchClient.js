class FetchClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    get = (endpoint) => {
        return fetch(this.baseUrl + endpoint) // shouldn't return be implicit??
            .then(response => response.json())
    }

    post = (endpoint, dataObj) => {
        return fetch(this.baseUrl + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(dataObj)
        })
            .then(response => response.json())
    }

    patch = (endpoint, dataObj) => {
        return fetch(this.baseUrl + endpoint, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(dataObj)
        })
            .then(response => response.json())
    }

    delete = (endpoint) => {
        return fetch(this.baseUrl + endpoint, {
            method: "DELETE"
        })
            .then(response => response.json())
    }
    

}

const baseUrl = "https://homestry.herokuapp.com/"
const client = new FetchClient(baseUrl)