import ZAI from 'z-ai-web-dev-sdk';

async function testSearch() {
  try {
    const zai = await ZAI.create()

    const searchResult = await zai.functions.invoke("web_search", {
      query: "What is the capital of France?",
      num: 10
    })

    console.log('Full API Response:', searchResult)
    

  } catch (error: any) {
    console.error('An error occurred:', error.message);
  }
}

testSearch()