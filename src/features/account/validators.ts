export function validateProfileUrlProtocol(url: string) : boolean {
    const allowHttp = window.location.protocol === "http:"
    if (allowHttp) {
        if (url !== "" && !url.startsWith("http://")
            && !url.startsWith("https://")) {
            return false
        }
    } else {
        if (url !== "" && !url.startsWith("https://")) {
            return false
        }
    }
    return true
}
