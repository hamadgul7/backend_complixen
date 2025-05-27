const Company = require('../../models/companyOwner/companyDetails-model');
const User = require('../../models/user');

async function deleteCompanyById(req, res) {
    try {
        const companyId = req.params.id;

        const deletedCompany = await Company.findByIdAndDelete(companyId);

        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const deletedUser = await User.findByIdAndDelete(deletedCompany.createdBy);
        if (!deletedUser) {
            return res.status(404).json({ message: `Company's User Not Found` });
        }

        res.status(200).json({ message: 'Company and its user deleted successfully', deletedCompany });
    } catch (error) {
        console.error('Delete Company Error:', error);
        res.status(500).json({ message: 'Failed to delete company', error: error.message });
    }
}

module.exports = {
    deleteCompanyById: deleteCompanyById
}