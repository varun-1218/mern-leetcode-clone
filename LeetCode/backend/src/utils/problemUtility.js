// const axios = require('axios');


// const getLanguageById = (lang)=>{

//     const language = {
//         "c++":54,
//         "java":62,
//         "javascript":63
//     }


//     return language[lang.toLowerCase()];
// }


// const submitBatch = async (submissions)=>{


// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//    base64_encoded: "false",
//   },
//   headers: {
//     'x-rapidapi-key': process.env.JUDGE0_KEY,
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     submissions
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data;
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

//  return await fetchData();

// }


// const waiting = async(timer)=>{
//   setTimeout(()=>{
//     return 1;
//   },timer);
// }

// // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

// const submitToken = async(resultToken)=>{

// const options = {
//   method: 'GET',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     tokens: resultToken.join(","),
//     base64_encoded: 'false',
//     fields: '*'
//   },
//   headers: {
//     'x-rapidapi-key': process.env.JUDGE0_KEY,
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data;
// 	} catch (error) {
// 		console.error(error);
// 	}
// }


//  while(true){

//  const result =  await fetchData();

//   const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

//   if(IsResultObtained)
//     return result.submissions;

  
//   await waiting(1000);
// }



// }


// module.exports = {getLanguageById,submitBatch,submitToken};






const axios = require('axios');

const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    };
    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
    console.log("🔄 Submitting batch to Judge0...");
    
    // Convert to base64
    const base64Submissions = submissions.map(sub => ({
        ...sub,
        source_code: Buffer.from(sub.source_code).toString('base64'),
        stdin: Buffer.from(sub.stdin).toString('base64'),
        expected_output: Buffer.from(sub.expected_output).toString('base64')
    }));

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: { base64_encoded: 'true' },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: { submissions: base64Submissions }
    };

    console.log("📤 Request:", {
        url: options.url,
        base64_encoded: options.params.base64_encoded,
        submissions_count: base64Submissions.length
    });

    try {
        const response = await axios.request(options);
        console.log("✅ Submit batch success");
        return response.data;
    } catch (error) {
        console.error('❌ Error in submitBatch:', error.response?.data || error.message);
        throw error;
    }
};

const waiting = (timer) => {
    return new Promise(resolve => setTimeout(resolve, timer));
};

const submitToken = async (resultToken) => {
    console.log("🔄 Checking token results:", resultToken);
    
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    console.log("📥 Request params:", options.params);

    while (true) {
        try {
            const response = await axios.request(options);
            console.log("✅ Token response received");
            
            // Decode base64 responses
            const submissions = response.data.submissions.map(sub => ({
                ...sub,
                source_code: sub.source_code ? Buffer.from(sub.source_code, 'base64').toString() : null,
                stdin: sub.stdin ? Buffer.from(sub.stdin, 'base64').toString() : null,
                stdout: sub.stdout ? Buffer.from(sub.stdout, 'base64').toString() : null,
                expected_output: sub.expected_output ? Buffer.from(sub.expected_output, 'base64').toString() : null,
                compile_output: sub.compile_output ? Buffer.from(sub.compile_output, 'base64').toString() : null,
                stderr: sub.stderr ? Buffer.from(sub.stderr, 'base64').toString() : null,
                message: sub.message ? Buffer.from(sub.message, 'base64').toString() : null
            }));

            const isResultObtained = submissions.every((r) => r.status_id > 2);
            if (isResultObtained) {
                console.log("✅ All results obtained");
                return submissions;
            }

            console.log("⏳ Waiting for results...");
            await waiting(1000);
        } catch (error) {
            console.error('❌ Error in submitToken:', error.response?.data || error.message);
            throw error;
        }
    }
};

module.exports = { getLanguageById, submitBatch, submitToken };