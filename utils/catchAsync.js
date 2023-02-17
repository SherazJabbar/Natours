// this function returns a new anonymous function
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}