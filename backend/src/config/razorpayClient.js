const Razorpay = require('razorpay');

apiKey="rzp_test_mD3CJAT5P4rk94"
apiSecret="yEsxsi7jRsCv1rqRxLVtTJtf"

const razorpay = new Razorpay({
    key_id: apiKey,
    key_secret: apiSecret,
  });


  module.exports=razorpay;