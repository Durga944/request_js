const axios = require('axios')
const fs = require('fs')
let readlineSync = require('readline-sync')

axios.get("http://saral.navgurukul.org/api/courses").then((resp) => {
    const str = JSON.stringify(resp.data,null,4)



    const promise = new Promise ((resolve,reject)=>{
        setTimeout(()=>{

        fs.writeFile("request_courses.json", str,(err) => {
            resolve ("data wrote.....")})

        } , 2000)
    })


    const prom1 = new Promise ((resolve,reject)=>{
        setTimeout(()=>{
            fs.readFile("request_courses.json",(err, str) => {
                resolve(JSON.parse(str))
            })

        },4000)

    })
    async function getOutput() {
        try{
            num1 = await promise
            num2 = await prom1

            let coursesList =  (num2["availableCourses"])
            

            for(i in coursesList) {
                console.log(`${i}  ${coursesList[i]["name"]} ${coursesList[i]["id"]}`);
                console.log("\n");

            }
            var user_id = readlineSync.question('Please enter the course id ? ');
            var id = coursesList[user_id]["id"]
            console.log(`Your course name is :- ${coursesList[user_id]["name"]}`);
            console.log("\n");


            let url = (" http://saral.navgurukul.org/api/courses/74/exercises")
            let res = await axios.get(url)
            let getData = res.data;
            let req = JSON.stringify(getData,null,2)
            fs.writeFileSync("req_exercises.json",req);

            const exercise = await axios.get('http://saral.navgurukul.org/api/courses/'+id+'/exercises')

            var exercise_name = exercise.data
            const exerciseData = (exercise_name["data"])

            var list_of_slug=[]
            for (j in exerciseData) {
                console.log(`${j}  ${exerciseData[j]["name"]}`);
                list_of_slug.push(j,exerciseData[j]["name"])
            }

            const userSlug = readlineSync.question("enter your slug id :-")
            const slug_data = (exerciseData[userSlug]["slug"])
            console.log(slug_data)
            console.log("\n")

            const slugData = await axios.get('http://saral.navgurukul.org/api/courses/'+id+'/exercise/getBySlug?slug='+slug_data)
            
            const value = slugData.data
            const slugcontent = (value["content"])
            console.log(`${slugcontent}`)
            console.log("\n")

        }
        catch(err){
            console.log(err);
        }
    }
    getOutput();
});

