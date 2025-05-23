import express from 'express';
const app = express();
const port = 3000;


const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404 
}

const db = {
    courses: [
        { id: 1, title: 't1' },
        { id: 2, title: 't2' },
        { id: 3, title: 't3' },
        { id: 4, title: 't4' }
    ]
}

app.get('/user', (req, res) => {
    let foundCourse = db.courses;
    if (req.query.title) {
        foundCourse = foundCourse
            .filter(c => c.title.indexOf(req.query.title as string) > -1)
    }
    res.json(foundCourse);
})

app.get('/user/:id', (req, res) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse)
})

app.post('/user', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    }
    db.courses.push(createdCourse);
    console.log(createdCourse);
    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(createdCourse);
})

app.delete('/user/:id', (req, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

app.put('/user/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const updateCourse = db.courses.find(c => c.id === +req.params.id)
    if (!updateCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    updateCourse.title = req.body.title;
    res.status(HTTP_STATUSES.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})