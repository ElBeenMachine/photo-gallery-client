import nc from "next-connect";

function onError(err, req, res, next) {
    console.error(err);
    res.status(500).end(err.toString());
}

const handler = nc({
    onError,
    onNoMatch: (req, res) => {
        res.status(404).send("Page not found");
    }
});

export default handler;