const randomCode = () => {
    const characCode = "ABCDEGHIKLNMIOUXZ";
    let result = '';
    const length = 6
    const characCodeLength = characCode.length
    for (let i = 0; i < length; i++) {
        const locationCode = Math.floor(Math.random() * characCodeLength)
        const code = characCode[locationCode]
        result += code
    }
    return result
}

export default randomCode