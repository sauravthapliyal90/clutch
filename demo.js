
const asyncFun = async () => {
    const payload = await start();
    const payload2 = await start2();
    
    console.log("payload---",payload);
    console.log("payload2---",payload2);
    console.log("async end");
    
}

// const funFun= () => {
//     console.log("me yha hu")
// }

const start2 = () => {
    // return (
        // new Promise((resolve) => {
            setTimeout(() => {
                console.log("async called2222")
            }, 5000)
        // })
    // )

} 

const start = () => {
    //     new Promise((resolve) => {
           setTimeout(() => {
                console.log("async called")
            }, 5000)
        // })

}
asyncFun();

// funFun()

console.log("i am here");
