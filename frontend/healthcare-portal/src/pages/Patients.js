import React, {useEffect, useState} from 'react';
import {Container, Paper, Typography, Box} from '@mui/material';
import TableTemplate from '../components/TableTemplate';
import {getPersonaRecords} from '../api/api';

const Patients = () => {
  const columns = ['Persona ID', 'Persona Status', 'Record ID', 'Date', 'Treatment Type', 'Problem', 'Cost'];
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const records = await getPersonaRecords();
        const jsonBody = await records.json();
        const formattedPatients = jsonBody.map(patient => ({
          PersonaID: patient.personaid,
          PersonaStatus: patient.isadmitted ? 'Admitted' : 'Discharged',
          RecordID: patient.recordid,
          Date: patient.date,
          TreatmentType: patient.treatmentname,
          Problem: patient.problem,
          Cost: patient.treatmentcost + " ₥"
        }));
        setPatients(formattedPatients);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatients();

  }, []);

  return (
    <Container maxWidth="lg">
      <Paper className="tablePaper">
        <Typography variant="h4" align="center" className="tableHeading">Persona Table</Typography>
        <TableTemplate columns={columns} rows={patients} />
      </Paper>
    </Container>
  );
};

export default Patients;
