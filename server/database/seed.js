/**
 * Seed script for Waste Collection Worker Attendance and Route Register
 * Task 1 requirement: ~40 realistic records with awkward test cases.
 */

const sampleRecords = [
  { date: '2026-07-25', worker_id: 'WRK-101', worker_name: 'Ramesh Kumar', route_id: 'RT-01', ward: 'Ward-1', covered: 'No', complaints_received: 5, remarks: 'Vehicle breakdown near main junction' },
  { date: '2026-07-25', worker_id: 'WRK-102', worker_name: 'Ramesh Kumar V.', route_id: 'RT-02', ward: 'Ward-1', covered: 'Yes', complaints_received: 0, remarks: 'Completed on time' },
  { date: '2026-07-25', worker_id: 'WRK-103', worker_name: 'Suresh K.', route_id: 'RT-03', ward: 'Ward-2', covered: 'No', complaints_received: 8, remarks: 'Worker reported sick, no replacement' },
  { date: '2026-07-25', worker_id: 'WRK-104', worker_name: 'Suresh Kumar', route_id: 'RT-04', ward: 'Ward-2', covered: 'Yes', complaints_received: 1, remarks: 'Minor delay due to rain' },
  { date: '2026-07-25', worker_id: 'WRK-105', worker_name: 'Anand Sharma', route_id: 'RT-05', ward: 'Ward-3', covered: 'No', complaints_received: 12, remarks: 'Road block on market street' },
  { date: '2026-07-25', worker_id: 'WRK-106', worker_name: 'Priya Dharshini', route_id: 'RT-06', ward: 'Ward-3', covered: 'Yes', complaints_received: 0, remarks: '' }, // Awkward case: missing remarks
  { date: '2026-07-25', worker_id: 'WRK-107', worker_name: 'Karthik Raja', route_id: 'RT-07', ward: 'Ward-4', covered: 'Yes', complaints_received: 0, remarks: 'All clear' },
  { date: '2026-07-25', worker_id: 'WRK-108', worker_name: 'Murugan M.', route_id: 'RT-08', ward: 'Ward-4', covered: 'No', complaints_received: 6, remarks: 'Fuel tank leakage' },
  { date: '2026-07-25', worker_id: 'WRK-109', worker_name: 'Lakshmi Narayanan', route_id: 'RT-09', ward: 'Ward-5', covered: 'Yes', complaints_received: 2, remarks: 'Overfilled bins reported' },
  { date: '2026-07-25', worker_id: 'WRK-110', worker_name: 'Vijay Kumar', route_id: 'RT-10', ward: 'Ward-5', covered: 'Yes', complaints_received: 0, remarks: 'Routine collection done' },
  
  { date: '2026-07-24', worker_id: 'WRK-101', worker_name: 'Ramesh Kumar', route_id: 'RT-01', ward: 'Ward-1', covered: 'No', complaints_received: 4, remarks: 'Heavy rain interruption' },
  { date: '2026-07-24', worker_id: 'WRK-102', worker_name: 'Ramesh Kumar V.', route_id: 'RT-02', ward: 'Ward-1', covered: 'Yes', complaints_received: 1, remarks: 'Overflow near school gate' },
  { date: '2026-07-24', worker_id: 'WRK-103', worker_name: 'Suresh K.', route_id: 'RT-03', ward: 'Ward-2', covered: 'Yes', complaints_received: 0, remarks: 'Smooth operation' },
  { date: '2026-07-24', worker_id: 'WRK-104', worker_name: 'Suresh Kumar', route_id: 'RT-04', ward: 'Ward-2', covered: 'No', complaints_received: 7, remarks: 'Compactor failure' },
  { date: '2026-07-24', worker_id: 'WRK-105', worker_name: 'Anand Sharma', route_id: 'RT-05', ward: 'Ward-3', covered: 'Yes', complaints_received: 0, remarks: '' },
  { date: '2026-07-24', worker_id: 'WRK-106', worker_name: 'Priya Dharshini', route_id: 'RT-06', ward: 'Ward-3', covered: 'No', complaints_received: 9, remarks: 'Festival crowd blocked access' },
  { date: '2026-07-24', worker_id: 'WRK-107', worker_name: 'Karthik Raja', route_id: 'RT-07', ward: 'Ward-4', covered: 'Yes', complaints_received: 0, remarks: 'Normal round' },
  { date: '2026-07-24', worker_id: 'WRK-108', worker_name: 'Murugan M.', route_id: 'RT-08', ward: 'Ward-4', covered: 'Yes', complaints_received: 0, remarks: 'Completed' },
  { date: '2026-07-24', worker_id: 'WRK-109', worker_name: 'Lakshmi Narayanan', route_id: 'RT-09', ward: 'Ward-5', covered: 'No', complaints_received: 3, remarks: 'Hydraulic ramp failure' },
  { date: '2026-07-24', worker_id: 'WRK-110', worker_name: 'Vijay Kumar', route_id: 'RT-10', ward: 'Ward-5', covered: 'Yes', complaints_received: 0, remarks: 'Clear' },

  { date: '2026-07-23', worker_id: 'WRK-111', worker_name: 'Deepak Raj', route_id: 'RT-11', ward: 'Ward-6', covered: 'No', complaints_received: 15, remarks: 'Crew absent without notice' },
  { date: '2026-07-23', worker_id: 'WRK-112', worker_name: 'Ganesh Nathan', route_id: 'RT-12', ward: 'Ward-6', covered: 'Yes', complaints_received: 0, remarks: 'Shift completed' },
  { date: '2026-07-23', worker_id: 'WRK-113', worker_name: 'Manish Verma', route_id: 'RT-13', ward: 'Ward-7', covered: 'Yes', complaints_received: 2, remarks: 'Commercial waste heavy' },
  { date: '2026-07-23', worker_id: 'WRK-114', worker_name: 'Saravanan P.', route_id: 'RT-14', ward: 'Ward-7', covered: 'No', complaints_received: 10, remarks: 'Tire puncture delay' },
  { date: '2026-07-23', worker_id: 'WRK-115', worker_name: 'Dinesh Karthik', route_id: 'RT-15', ward: 'Ward-8', covered: 'Yes', complaints_received: 0, remarks: '' },
  { date: '2026-07-23', worker_id: 'WRK-116', worker_name: 'Balan S.', route_id: 'RT-16', ward: 'Ward-8', covered: 'Yes', complaints_received: 0, remarks: 'Good coverage' },
  { date: '2026-07-23', worker_id: 'WRK-117', worker_name: 'Sundar C.', route_id: 'RT-17', ward: 'Ward-9', covered: 'No', complaints_received: 6, remarks: 'Waterlogging on main avenue' },
  { date: '2026-07-23', worker_id: 'WRK-118', worker_name: 'Venkatesh Rao', route_id: 'RT-18', ward: 'Ward-9', covered: 'Yes', complaints_received: 1, remarks: 'Resident query handled' },
  { date: '2026-07-23', worker_id: 'WRK-199', worker_name: 'Unassigned Worker', route_id: 'RT-99', ward: 'Ward-99', covered: 'Yes', complaints_received: 0, remarks: 'Isolated test record with no complaints' }, // Awkward case: unlinked/isolated record
  { date: '2026-07-23', worker_id: 'WRK-120', worker_name: 'Arun Prakash', route_id: 'RT-20', ward: 'Ward-10', covered: 'Yes', complaints_received: 0, remarks: 'All done' },

  { date: '2026-07-22', worker_id: 'WRK-101', worker_name: 'Ramesh Kumar', route_id: 'RT-01', ward: 'Ward-1', covered: 'Yes', complaints_received: 0, remarks: 'Normal' },
  { date: '2026-07-22', worker_id: 'WRK-103', worker_name: 'Suresh K.', route_id: 'RT-03', ward: 'Ward-2', covered: 'No', complaints_received: 11, remarks: 'Depot dispatch delay' },
  { date: '2026-07-22', worker_id: 'WRK-105', worker_name: 'Anand Sharma', route_id: 'RT-05', ward: 'Ward-3', covered: 'No', complaints_received: 4, remarks: 'Truck undergoing maintenance' },
  { date: '2026-07-22', worker_id: 'WRK-108', worker_name: 'Murugan M.', route_id: 'RT-08', ward: 'Ward-4', covered: 'Yes', complaints_received: 0, remarks: 'Completed' },
  { date: '2026-07-22', worker_id: 'WRK-111', worker_name: 'Deepak Raj', route_id: 'RT-11', ward: 'Ward-6', covered: 'No', complaints_received: 14, remarks: 'Uncollected bulk waste complaint' },
  { date: '2026-07-22', worker_id: 'WRK-114', worker_name: 'Saravanan P.', route_id: 'RT-14', ward: 'Ward-7', covered: 'Yes', complaints_received: 0, remarks: '' },
  { date: '2026-07-22', worker_id: 'WRK-117', worker_name: 'Sundar C.', route_id: 'RT-17', ward: 'Ward-9', covered: 'Yes', complaints_received: 0, remarks: 'On schedule' },
  { date: '2026-07-21', worker_id: 'WRK-101', worker_name: 'Ramesh Kumar', route_id: 'RT-01', ward: 'Ward-1', covered: 'No', complaints_received: 3, remarks: 'Driver shift conflict' },
  { date: '2026-07-21', worker_id: 'WRK-105', worker_name: 'Anand Sharma', route_id: 'RT-05', ward: 'Ward-3', covered: 'Yes', complaints_received: 0, remarks: 'Clean route' },
  { date: '2026-07-21', worker_id: 'WRK-111', worker_name: 'Deepak Raj', route_id: 'RT-11', ward: 'Ward-6', covered: 'No', complaints_received: 8, remarks: 'Sanitation strike in pocket B' },
];

function seed(db) {
  const count = db.prepare('SELECT COUNT(*) as count FROM attendance_records').get().count;
  // Re-seed if existing records are under 10 or schema changed
  if (count < 10) {
    db.prepare('DELETE FROM attendance_records').run();
    const insertStmt = db.prepare(`
      INSERT INTO attendance_records (date, worker_id, worker_name, route_id, ward, covered, complaints_received, remarks)
      VALUES (@date, @worker_id, @worker_name, @route_id, @ward, @covered, @complaints_received, @remarks)
    `);

    const insertMany = db.transaction((records) => {
      for (const record of records) {
        insertStmt.run(record);
      }
    });

    insertMany(sampleRecords);
    console.log(`Successfully seeded ${sampleRecords.length} Waste Collection Worker Attendance & Route records.`);
  }
}

module.exports = { seed, sampleRecords };
