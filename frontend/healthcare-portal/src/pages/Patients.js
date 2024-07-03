import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';
import { getPersonaRecords } from '../api/api';

const Patients = () => {
 const columns = ['Persona ID', 'Persona Status', 'Record ID', 'Date', 'Treatment Type', 'Problem', 'Cost'];

const patients = [
  { recordid: 1, personalid: 1, PersonaStatus: 'Admitted', date: '2023-06-01', TreatmentType: 'Surgery', problem: 'Appendicitis', cost: 5000 },
  { recordid: 2, personalid: 2, PersonaStatus: 'Discharged', date: '2023-06-10', treatmentname: 'Physical Therapy', problem: 'Back Pain', cost: 300 },
  { recordid: 3, personalid: 3, PersonaStatus: 'Admitted', date: '2023-06-15', treatmentname: 'Medication', problem: 'Hypertension', cost: 150 },
  { recordid: 4, personalid: 4, PersonaStatus: 'Discharged', date: '2023-06-20', treatmentname: 'Doctor Visit', problem: 'Flu', cost: 100 },
  { recordid: 5, personalid: 5, PersonaStatus: 'Admitted', date: '2023-06-25', treatmentname: 'Surgery', problem: 'Gallstones', cost: 6000 },
  { recordid: 6, personalid: 6, PersonaStatus: 'Discharged', date: '2023-06-30', treatmentname: 'Physical Therapy', problem: 'Shoulder Pain', cost: 400 },
  { recordid: 7, personalid: 7, PersonaStatus: 'Admitted', date: '2023-07-01', treatmentname: 'Medication', problem: 'Diabetes', cost: 200 },
  { recordid: 8, personalid: 8, PersonaStatus: 'Discharged', date: '2023-07-05', treatmentname: 'Doctor Visit', problem: 'Headache', cost: 80 },
  { recordid: 9, personalid: 9, PersonaStatus: 'Admitted', date: '2023-07-10', treatmentname: 'Surgery', problem: 'Hernia', cost: 7000 },
  { recordid: 10, personalid: 10, PersonaStatus: 'Discharged', date: '2023-07-15', treatmentname: 'Physical Therapy', problem: 'Knee Pain', cost: 350 },
];

getPersonaRecords().then((records) => console.log(records)).catch((err) => console.log(err));

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
