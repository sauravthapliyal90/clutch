const p = new Promise((resolve, reject) => {
   setTimeout(() => {
      resolve('Promise resolved after 2 seconds');
   }, 2000);
})

const p2 = new Promise((resolve, reject) => {
   setTimeout(() => {
      resolve('Promise resolved after 2 seconds');
   }, 10000);
})

async function asyncCall() {
   console.log('Calling an async function...');
   const result = await p;
   console.log(result);

   const result2 = await p2;
   console.log(result2);
}
asyncCall();