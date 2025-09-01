import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function testAI() {
  try {
    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: 'Hello, who are you?'
        }
      ],
      // Other parameters like temperature, max_tokens, etc. can be added here.
    });

    console.log('Full API Response:', completion);

    // Example: Accessing the message content from the first choice
    const messageContent = completion.choices[0]?.message?.content;
    if (messageContent) {
      console.log('Assistant says:', messageContent);
    }

  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

async function generateImage() {
  try {
    const zai = await ZAI.create();

    const response = await zai.images.generations.create({
      prompt: 'A cute cat playing in the garden',
      quality: 'hd', // 'standard' or 'hd'
      size: '1024x1024' // Various sizes supported
    });

    // Returns base64 encoded image data
    const imageBase64 = response.data[0].base64;
    console.log('Generated image base64:', imageBase64);

    // save to png
    fs.writeFileSync('generated_image.png', imageBase64, 'base64');

  } catch (error) {
    console.error('Image generation failed:', error.message);
  }
}

generateImage()