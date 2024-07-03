const mongoose = require("mongoose");
const {Schema} = mongoose;


main()
.then(()=> console.log("connection successful"))

.catch((err) => console.log(err));


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/relationDemo")
}

const orderSchema= new Schema({
    item:String,
    price:Number,
})

const customerSchema= new Schema({

 name:String,
 orders:[
    {
        type:Schema.Types.ObjectId,
        ref:"Order",
    }
 ]
})

// customerSchema.pre("findOneAndDelete",async()=>{
//     console.log("PRE MIDDLEWARE");
// })


customerSchema.post("findOneAndDelete",async(customer)=>{
    if(customer.orders.length){
      let result= await  Order.deleteMany({_id: {$in: customer.orders} });
      console.log(result);
    }
   
})

const Order= mongoose.model("Order",orderSchema);
const Customer= mongoose.model("Customer",customerSchema);
// using populate
const findCustomer=async() =>{
    let result = await Customer.find({}).populate("orders");
    console.log(result);
}

// findCustomer();


const addCust=async()=>{
    let newCust= new Customer({
        name:"Karan Arjun"
    })
    let newOrder=new Order({
        item:"Burger",
        price:250
    })

    newCust.orders.push(newOrder)
    await newOrder.save();
    await newCust.save();
    console.log("added new customer");
}

const delCust=async()=>{
   let data= await Customer.findByIdAndDelete('668409aadf59bd6855dad440');
   console.log(data);
}
// addCust();
delCust();













// const addCustomer= async() =>{
    // let cust1 = new Customer({
    //     name:"Sarita Maurya",
    // })
    // let order1= await Order.findOne({item:"Chips"});
    //  let order2= await Order.findOne({item:"Chocolate"});

    //  cust1.orders.push(order1);
    //  cust1.orders.push(order2);

    // let result= await cust1.save();
    // console.log(result);

//     let result= await Customer.find({});
//     console.log(result);
// }
// addCustomer();

// const addOrders=async() =>{
//     let res=await Order.insertMany([
//         {
//             item:"Smosa", price:12
//         },
//         {item:"Chips",price:10},
//         {item:"Chocolate",price:40},
//     ])
//     console.log(res);
// }
// addOrders();