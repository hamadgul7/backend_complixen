const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/user");
const controlCodeRoutes = require('./routes/controlCode-routes');

//Company
const companyRoutes = require('./routes/companyOwner/companyRoutes');
const companyControlRoutes = require('./routes/companyOwner/companyControl-routes');
const companyEvidenceRoutes = require('./routes/companyOwner/companyEvidence-routes');

//Admin
const adminManageCompanyRoutes = require('./routes/administration/manageCompany-routes');
const adminManageControlRoutes = require('./routes/administration/manageControl-routes');
const adminManageComplianceFrameworkRoutes = require('./routes/administration/manageComplianceFramework-routes');

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('🚀 Backend API is running...');
});

// Auth routes
app.use('/api/auth', authRoutes);

// User Routes
app.use("/api/user", userRoutes);
app.use('/api/controlCode', controlCodeRoutes);

//Company Owner
app.use('/api/company', companyRoutes);
app.use('/api/company/control', companyControlRoutes);
app.use('/api/company/evidence', companyEvidenceRoutes);

//Admin
app.use('/api/admin/company', adminManageCompanyRoutes);
app.use('/api/admin/control', adminManageControlRoutes);
app.use('/api/admin/complianceFramework', adminManageComplianceFrameworkRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`🌍 Server is running on port ${PORT}`);
});
