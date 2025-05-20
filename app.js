const express=require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const PORT = 8004;

const app=express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

//making public file static
app.use(express.static('public'));

//seting view engine
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.get('/home',(req,res)=>{
    return res.render("home");
})
// app.get('/evolutionVideo',(req,res)=>{
//     return res.render("evolutionVideo");
// })
app.get('/exploreImage',(req,res)=>{
    return res.render("exploreImage");
})
app.get('/about',(req,res)=>{
    return res.render("about");
})
app.get('/contact',(req,res)=>{
    return res.render("contact");
})
app.get('/jwst_telescope',(req,res)=>{
    return res.render("jwt_telescope.ejs");
})
app.get('/exploreImage',(req,res)=>{
    return res.render("exploreImage");
})
app.get('/jwt',(req,res)=>{
    return res.render("jwst_intro");
})
app.get('/3d_model/jwst',(req,res)=>{
    return res.render("jwst_3d");
})
app.get('/jupiter',(req,res)=>{
    return res.render("jupiter_intro");
})
app.get('/3d_model/jupiter',(req,res)=>{
    return res.render("jupiter_3d");
})
app.get('/aestroid',(req,res)=>{
    return res.render("aestroid_intro");
})
app.get('/3d_model/aestroid',(req,res)=>{
    return res.render("aestroid_3d");
})
app.get('/orion_nebula',(req,res)=>{
    return res.render("orion_nebula_intro");
})
app.get('/3d_model/orion_nebula',(req,res)=>{
    return res.render("orion_nebula_3d");
})
app.get('/faq',(req,res)=>{
    return res.render("faq");
})

const questions = [
    {
        id: 1,
        question: 'What is the name of the force that pulls objects toward the Earth?',
        options: ['Gravity', 'Magnetism', 'Friction', 'Inertia'],
        correctAnswer: 'Gravity'
    },
    {
        id: 2,
        question: 'What is the speed of light?',
        options: ['300,000 km/s', '150,000 km/s', '120,000 km/s', '250,000 km/s'],
        correctAnswer: '300,000 km/s'
    },
    {
        id: 3,
        question: 'Who developed the theory of relativity?',
        options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Marie Curie'],
        correctAnswer: 'Albert Einstein'
    }
];

let currentQuestionIndex = 0;
app.get("/evolutionVideo", (req,res)=>{
    res.render("evolutionVideo" , {questions : questions})
})
app.post("/submit-answers", async (req, res) => {
    let userAnswers = req.body.answers;

    if (!Array.isArray(userAnswers)) {
        userAnswers = Object.values(userAnswers); // Convert object to array if needed
    }

    userAnswers.shift(); // Remove the first empty element (if present)

    let correctCount = 0;
    let incorrectCount = 0;
    let feedback = [];

    // Process user answers
    questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            correctCount++;
        } else {
            incorrectCount++;
            feedback.push({
                question: question.question,
                userAnswer: userAnswers[index],
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            });
        }
    });

    const genAI = new GoogleGenerativeAI("AIzaSyAlSRMwkkHtlsNkZJHrdjXRvD4zJdOsLKI");


    let insights = "";
    if (feedback.length > 0) {
        const prompt = `
            A user took a quiz and got the following answers wrong: 
            ${feedback.map(f => `Question: ${f.question}\nUser's Answer: ${f.userAnswer}\nCorrect Answer: ${f.correctAnswer}\n`).join("\n")}
            Provide explanations on where the user went wrong, clarify misunderstandings, and offer tips on how to better understand the topics. tell him in hsort where he went wrong . make it intresting tell him intrestingly
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        insights = result.response.text();
    }

    // Render the report.ejs template with the result counts and AI feedback
    res.render('report', {
        correct: correctCount,
        incorrect: incorrectCount,
        total: questions.length,
        feedback: feedback,
        insights: insights // Pass AI-generated feedback
    });
});

app.listen(PORT,()=>console.log("server started at port:",PORT));

