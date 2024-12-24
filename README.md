# Bank Statement Extraction

This is a simple app that allows you to upload a bank statement, extract the transaction details, and analyze the data to provide a summary and risk assessment of creditworthiness.

## How to run

1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`


## Use it

The app is live at https://financial-data-extract.vercel.app/

To use:

1. Navigate to https://financial-data-extract.vercel.app/
2. Click "Login" and use the pre-filled credentials:
    - email: `casca@dtnewman.com`
    - password: `fba!JFU5juv!qvr!qbz`
3. Login and navigate to the "Extract" page
4. Upload a bank statement in PDF format and follow the instructions

## Future Work

This was built as a proof of concept and has several important limitations:

- It only works with bank statements in PDF format
- It uses the OpenAI API to extract the data and only makes a single request to the API, so it is limited to their tokens.
- OpenAI's vision models are decent, but not perfect for extracting data from tables. A better approach would combine a more traditional OCR approach with a structured data extraction approach (for example, [Amazon Textract](https://aws.amazon.com/textract/))

Most importantly, the data sets provided are very limited. We have a single bank statement for a single user for a single month. In an ideal world, we would would to have a larger dataset of bank statements in order to better detect recurring vs. one-off transactions and other anomalies. Also, we would ideally want to combine our model with other data sources outlining financial risks factors.

In general, this makes use of OpenAI's API extensively, rather than building a statistical or ML-based model, since the latter would require a much larger dataset.
