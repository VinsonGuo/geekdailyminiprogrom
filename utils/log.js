module.exports = (tag) => {
    return (msg) => {
        console.log(tag + ' start ================')
        console.log(msg)
        console.log(tag + ' end ================')
    }
}