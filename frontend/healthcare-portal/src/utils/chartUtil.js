export const getBarChartData = (json) => {
    const data = JSON.parse(json).data.items;

    //Check date format and month to be displayed
    const monthlyRevenue = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
      Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
    };

    data.forEach(item => {
      const date = new Date(item.date);
      const month = date.toLocaleString('default', { month: 'short' });

      if (item.status === "completed") {
        monthlyRevenue[month] += item.amount;
      }
    });

    const barChartData = Object.keys(monthlyRevenue).map(month => ({
      month,
      revenue: monthlyRevenue[month]
    }));

    return barChartData;
};

export const getPieChartData = (json) => {
    const data = JSON.parse(json);

    const treatmentCounts = {};

    data.forEach(item => {
      const treatmentName = item.treatmentname;
      if (treatmentCounts[treatmentName]) {
        treatmentCounts[treatmentName] += 1;
      } else {
        treatmentCounts[treatmentName] = 1;
      }
    });

    const pieChartData = Object.keys(treatmentCounts).map(name => ({
      name,
      value: treatmentCounts[name]
    }));

    return pieChartData;
  };
