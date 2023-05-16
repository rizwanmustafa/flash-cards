import express from "express";
import joi from "joi";
import responseTime from "response-time";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(responseTime());
app.use(morgan("tiny"));


app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello world!");
});

const flashCardSchema = joi.object({
  question: joi.string().required(),
  correctAnswer: joi.number().required(),
  answers: joi.array().items(joi.string()).required(),
});

const flashCards: FlashCard[] = [];

app.get("/flash-cards/", (req: express.Request, res: express.Response) => {
  res.status(200).send({ data: { flashCards: flashCards } });
});


app.post("/flash-cards/", (req: express.Request, res: express.Response) => {
  // Get JSON data from request
  const data = req.body;

  const { error } = flashCardSchema.validate(data);

  if (error) {
    res.status(400).send(error.details[0].message);
  }
  else {
    flashCards.push(data);

    res.status(200).send({ message: "Flash card created successfully!", data: { id: flashCards.length - 1 } });
  }
});


const SERVER_PORT = process.env.PORT || 3000;

app.listen(SERVER_PORT, (): void => {
  console.log(`Server is running on port ${SERVER_PORT}!`);
  console.log(`Visit server at: http://localhost:${SERVER_PORT}/`);
});
