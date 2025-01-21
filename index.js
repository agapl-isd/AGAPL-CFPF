const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knujmnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const userDataCollection = client
      .db("cfpfCollection")
      .collection("userData");
    const customerDataCollection = client
      .db("cfpfCollection")
      .collection("customerData");
    const rangeCollection = client.db("cfpfCollection").collection("rangeData");


    // const calculationCollection = client.db("cfpfCollection").collection("calculationCollection");

    app.delete("/deleteParty/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await rangeCollection.deleteOne(query);
      res.send(result);
    });

    // Add multiple customer transactions
    app.post("/addCustomerTransactions", async (req, res) => {
      const customerTransactions = req.body;

      if (!Array.isArray(customerTransactions)) {
        return res
          .status(400)
          .json({ error: "Expected an array of transactions" });
      }

      try {
        const result = await rangeCollection.insertMany(customerTransactions);
        res.json({ insertedCount: result.insertedCount });
      } catch (error) {
        console.error("Error inserting transactions:", error);
        res.status(500).json({ error: "Server error" });
      }
    });

    // Customer APIs
    app.post("/addCustomer", async (req, res) => {
      const addCustomer = req.body;
      const result = await customerDataCollection.insertOne(addCustomer);
      res.send(result);
    });

    app.get("/allCustomer", async (req, res) => {
      const items = await rangeCollection.find().toArray();
      res.send(items);
    });

    app.get("/customerSingleData", async (req, res) => {
      const { customerCode, number } = req.query;
      const query = {
        customerCode: parseInt(customerCode),
        number: parseInt(number),
      };
      const data = await customerDataCollection.findOne(query);
      res.send(data);
    });

    app.get("/customerData", async (req, res) => {
      try {
        // Fetch all documents from the customer data collection
        const data = await customerDataCollection.find({}).toArray();

        if (data.length > 0) {
          res.json(data); // Send all customer data as response
        } else {
          res.status(404).json({ error: "No customer data found" });
        }
      } catch (error) {
        console.error("Error fetching all customer data:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/customerRangeData", async (req, res) => {
      const { customerCode, start, end } = req.query;
      
      if (!customerCode || !start || !end) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      try {
        const customerCodeNumber = parseInt(customerCode);
        const startNumber = parseInt(start, 10);
        const endNumber = parseInt(end, 10);
        // Fetch detailed customer data for the given range
        const rangeData = await customerDataCollection
          .find({
            customerCode: customerCodeNumber,
            number: { $gte: parseInt(startNumber), $lte: parseInt(endNumber) },
          })
          .toArray();

        res.json(rangeData);
        console.log(rangeData);
      } catch (error) {
        console.error("Error fetching range data:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

  

    app.patch("/addCustomersData", async (req, res) => {
      const {
        customerName,
        customerCode,
        number,
        DateofTransferofChicks,
        DateOfAsOn,
        DateOfDepartureOfChicks,
        SecurityDepositInLacTk,
        DayOldChicks,
        Mortality,
        ClosingNoOfDayOldChicks,
        TotalFeedQuantityInMT,
        FixedPricePerDOC,
        FixedPricePerKgFeed,
        FixedPurchasePricePerKgMeat,
        TotalWeightOfBroilerInKg,
        BroilerSellingPricePerKg,
        FreightCostPayable,
        ExcessPayment,
        fcr,
        contract_farmer_commision,
        ageofchicksday,
        doc,
        feed_sales_value,
        doc_sales_value,
        boiler_stocks_value,
        third_boiler_stocks_value,
        farmer_commision,
      } = req.body;
      console.log(req.body);

      const query = {
        customerCode: Number(customerCode),
        number: Number(number),
      };

      try {
        console.log("Query:", query); // Log the query to debug issues with finding the document

        // Fetch the existing document to merge fields
        const existingDocument = await customerDataCollection.findOne(query);

        console.log("Existing document:", existingDocument); // Log existing document to verify if it exists

        // Prepare the update payload with both new and existing data
        const update = {
          $set: {
            customerName: customerName || existingDocument?.customerName,

            DateofTransferofChicks:
              DateofTransferofChicks ||
              existingDocument?.DateofTransferofChicks,
            DateOfAsOn: DateOfAsOn || existingDocument?.DateOfAsOn,
            DateOfDepartureOfChicks:
              DateOfDepartureOfChicks ||
              existingDocument?.DateOfDepartureOfChicks,
            SecurityDepositInLacTk:
              SecurityDepositInLacTk ||
              existingDocument?.SecurityDepositInLacTk,
            DayOldChicks: DayOldChicks || existingDocument?.DayOldChicks,
            Mortality: Mortality || existingDocument?.Mortality,
            ClosingNoOfDayOldChicks:
              ClosingNoOfDayOldChicks ||
              existingDocument?.ClosingNoOfDayOldChicks,
            TotalFeedQuantityInMT:
              TotalFeedQuantityInMT || existingDocument?.TotalFeedQuantityInMT,
            FixedPricePerDOC:
              FixedPricePerDOC || existingDocument?.FixedPricePerDOC,
            FixedPricePerKgFeed:
              FixedPricePerKgFeed || existingDocument?.FixedPricePerKgFeed,
            FixedPurchasePricePerKgMeat:
              FixedPurchasePricePerKgMeat ||
              existingDocument?.FixedPurchasePricePerKgMeat,
            TotalWeightOfBroilerInKg:
              TotalWeightOfBroilerInKg ||
              existingDocument?.TotalWeightOfBroilerInKg,
            BroilerSellingPricePerKg:
              BroilerSellingPricePerKg ||
              existingDocument?.BroilerSellingPricePerKg,
            FreightCostPayable:
              FreightCostPayable || existingDocument?.FreightCostPayable,
            ExcessPayment: ExcessPayment || existingDocument?.ExcessPayment,
            fcr: fcr || existingDocument?.fcr,
            contract_farmer_commision:
              contract_farmer_commision ||
              existingDocument?.contract_farmer_commision,
              
              ageofchicksday:
              ageofchicksday ||
              existingDocument?.ageofchicksday,
              
              doc:
              doc ||
              existingDocument?.doc,
              
              feed_sales_value:
              feed_sales_value ||
              existingDocument?.feed_sales_value,
             
              doc_sales_value:
              doc_sales_value ||
              existingDocument?.doc_sales_value,
            
            
              boiler_stocks_value:
              boiler_stocks_value ||
              existingDocument?.boiler_stocks_value,
           
           
              third_boiler_stocks_value:
              third_boiler_stocks_value ||
              existingDocument?.third_boiler_stocks_value,
            
            
              farmer_commision:
              farmer_commision ||
              existingDocument?.farmer_commision,

          },
        };

        console.log("Update payload:", update); // Log the update payload to verify its structure

        // Perform the update or upsert
        const updatedData = await customerDataCollection.updateOne(
          query,
          update,
          { upsert: true }
        );

        if (updatedData.modifiedCount || updatedData.upsertedCount) {
          console.log("Document updated successfully");
          res.json({ updatedCount: 1, message: "Data updated successfully" });
        } else {
          console.log(
            "No document matched the query and no new document was inserted"
          );
          res.status(404).json({ message: "Data not found for update" });
        }
      } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Server Error" });
      }
    });


    app.patch("/addCustomersDataCalculation", async (req, res) => {
      const {
        customerName,
        customerCode,
        number,
        fcr,
        contract_farmer_commision,
        ageofchicksday,
        doc,
        feed_sales_value,
        doc_sales_value,
        boiler_stocks_value,
        third_boiler_stocks_value,
        farmer_commision,
      } = req.body;
      console.log(req.body);


      const query = {
        customerCode: Number(customerCode),
        number: Number(number),
      };

      try {
        console.log("Query:", query); // Log the query to debug issues with finding the document

        // Fetch the existing document to merge fields
        const existingDocument = await calculationCollection.findOne(query);

        console.log("Existing document:", existingDocument); // Log existing document to verify if it exists

        // Prepare the update payload with both new and existing data
        const update = {
          $set: {
            customerName: customerName || existingDocument?.customerName,

            
            fcr: fcr || existingDocument?.fcr,
            contract_farmer_commision:
              contract_farmer_commision ||
              existingDocument?.contract_farmer_commision,
              
              ageofchicksday:
              ageofchicksday ||
              existingDocument?.ageofchicksday,
              
              doc:
              doc ||
              existingDocument?.doc,
              
              feed_sales_value:
              feed_sales_value ||
              existingDocument?.feed_sales_value,
             
              doc_sales_value:
              doc_sales_value ||
              existingDocument?.doc_sales_value,
            
            
              boiler_stocks_value:
              boiler_stocks_value ||
              existingDocument?.boiler_stocks_value,
           
           
              third_boiler_stocks_value:
              third_boiler_stocks_value ||
              existingDocument?.third_boiler_stocks_value,
            
            
              farmer_commision:
              farmer_commision ||
              existingDocument?.farmer_commision,



          },
        };

        console.log("Update payload:", update); // Log the update payload to verify its structure

        // Perform the update or upsert
        const updatedData = await calculationCollection.updateOne(
          query,
          update,
          { upsert: true }
        );

        if (updatedData.modifiedCount || updatedData.upsertedCount) {
          console.log("Document updated successfully");
          res.json({ updatedCount: 1, message: "Data updated successfully" });
        } else {
          console.log(
            "No document matched the query and no new document was inserted"
          );
          res.status(404).json({ message: "Data not found for update" });
        }
      } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Server Error" });
      }
    });

    app.post("/addUser", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userDataCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists" });
      }

      const result = await userDataCollection.insertOne(user);
      res.send(result);
    });

    app.get("/userData", async (req, res) => {
      const userEmail = req.query.email;
      if (!userEmail) {
        res.send([]);
      }

      const query = { email: userEmail };
      const result = await userDataCollection.find(query).toArray();
      res.send(result);
    });

    // admin apis
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;

      const query = { email: email };
      const user = await userDataCollection.findOne(query);
      const result = { admin: user?.role === "admin" };
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Connected to MongoDB!");
  } finally {
    // Keep client open for server duration
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
