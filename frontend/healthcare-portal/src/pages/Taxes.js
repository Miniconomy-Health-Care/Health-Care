import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';
import { getTaxRecords } from '../api/api';

const Taxes = () => {
  const columns = ['Tax ID', 'Name', 'Month', 'Year', 'Amount'];
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    const sampleJson = `[
      {"taxid":1,"name":"VAT","month":"06","year":"24","amount":"1024"},
      {"taxid":2,"name":"Income","month":"03","year":"23","amount":"2048"},
      {"taxid":3,"name":"VAT","month":"12","year":"24","amount":"3072"},
      {"taxid":4,"name":"Income","month":"09","year":"22","amount":"4096"},
      {"taxid":5,"name":"VAT","month":"01","year":"25","amount":"5120"},
      {"taxid":6,"name":"Income","month":"04","year":"24","amount":"6144"},
      {"taxid":7,"name":"VAT","month":"08","year":"23","amount":"7168"},
      {"taxid":8,"name":"Income","month":"07","year":"25","amount":"8192"}
    ]`;

    const taxRecords = JSON.parse(sampleJson);

    const formattedTaxes = taxRecords.map(tax => ({
      'Tax ID': tax.taxid,
      'Name': tax.name,
      'Month': tax.month,
      'Year': tax.year,
      'Amount': tax.amount
    }));

    setTaxes(formattedTaxes);

    //Remove the code above once you make sure getTaxRecords() works when the actual API is ready
    getTaxRecords()
      .then((records) => {
        const formattedTaxes = records.map(tax => ({
          'Tax ID': tax.taxid,
          'Name': tax.name,
          'Month': tax.month,
          'Year': tax.year,
          'Amount': tax.amount
        }));
        setTaxes(formattedTaxes);
      })
      .catch((err) => console.log(err));
    
  }, []);

  return (
    <Container>
      <Paper className="tablePaper">
        <Typography variant="h4" align="center" className="tableHeading">Taxes Table</Typography>
        <TableTemplate columns={columns} rows={taxes} />
      </Paper>
    </Container>
  );
};

export default Taxes;