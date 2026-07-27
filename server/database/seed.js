/**
 * Seed script for Waste Collection Worker Attendance and Route Register
 * Task 1 requirement: ~40 realistic records with awkward test cases.
 */

const sampleRecords = [
  { date: '2026-07-25', worker_id: 'WRK-101', worker_name: 'Ramesh Kumar', phone_number: '9876543101', route_id: 'RT-01', ward: 'Ward-1', covered: 'No', complaints_received: 5, remarks: 'Vehicle breakdown near main junction' },
  { date: '2026-07-25', worker_id: 'WRK-102', worker_name: 'Ramesh Kumar V.', phone_number: '9876543102', route_id: 'RT-02', ward: 'Ward-1', covered: 'Yes', complaints_received: 0, remarks: 'Completed on time' },
  { date: '2026-07-25', worker_id: 'WRK-103', worker_name: 'Suresh K.', phone_number: '9876543103', route_id: 'RT-03', ward: 'Ward-2', covered: 'No', complaints_received: 8, remarks: 'Worker reported sick, no replacement' },
  { date: '2026-07-25', worker_id: 'WRK-104', worker_name: 'Suresh Kumar', phone_number: '9876543104', route_id: 'RT-04', ward: 'Ward-2', covered: 'Yes', complaints_received: 1, remarks: 'Minor delay due to rain' },
  { date: '2026-07-25', worker_id: 'WRK-105', worker_name: 'Anand Sharma', phone_number: '9876543105', route_id: 'RT-05', ward: 'Ward-3', covered: 'No', complaints_received: 12, remarks: 'Road block on market street' },
  { date: '2026-07-25', worker_id: 'WRK-106', worker_name: 'Priya Dharshini', phone_number: '9876543106', route_id: 'RT-06', ward: 'Ward-3', covered: 'Yes', complaints_received: 0, remarks: '' }, // Awkward case: missing remarks
  { date: '2026-07-25', worker_id: 'WRK-107', worker_name: 'Karthik Raja', phone_number: '9876543107', route_id: 'RT-07', ward: 'Ward-4', covered: 'Yes', complaints_received: 0, remarks: 'All clear' },
  { date: '2026-07-25', worker_id: 'WRK-108', worker_name: 'Murugan M.', phone_number: '9876543108', route_id: 'RT-08', ward: 'Ward-4', covered: 'No', complaints_received: 6, remarks: 'Fuel tank leakage' },
  { date: '2026-07-25', worker_id: 'WRK-109', worker_name: 'Lakshmi Narayanan', phone_number: '9876543109', route_id: 'RT-09', ward: 'Ward-5', covered: 'Yes', complaints_received: 2, remarks: 'Overfilled bins reported' },
  { date: '2026-07-25', worker_id: 'WRK-110', worker_name: 'Vijay Kumar', phone_number: '9876543110', route_id: 'RT-10', ward: 'Ward-5', covered: 'Yes', complaints_received: 0, remarks: 'Routine collection done' },
  
  { date: '2026-07-24', worker_id: 'WRK-101', worker_name: 'Ramesh Kumar', phone_number: '9876543101', route_id: 'RT-01', ward: 'Ward-1', covered: 'No', complaints_received: 4, remarks: 'Heavy rain interruption' },
  { date: '2026-07-24', worker_id: 'WRK-102', worker_name: 'Ramesh Kumar V.', phone_number: '9876543102', route_id: 'RT-02', ward: 'Ward-1', covered: 'Yes', complaints_received: 1, remarks: 'Overflow near school gate' },
  { date: '2026-07-24', worker_id: 'WRK-103', worker_name: 'Suresh K.', phone_number: '9876543103', route_id: 'RT-03', ward: 'Ward-2', covered: 'Yes', complaints_received: 0, remarks: 'Smooth operation' },
  { date: '2026-07-24', worker_id: 'WRK-104', worker_name: 'Suresh Kumar', phone_number: '9876543104', route_id: 'RT-04', ward: 'Ward-2', covered: 'No', complaints_received: 7, remarks: 'Compactor failure' },
  { date: '2026-07-24', worker_id: 'WRK-105', worker_name: 'Anand Sharma', phone_number: '9876543105', route_id: 'RT-05', ward: 'Ward-3', covered: 'Yes', complaints_received: 0, remarks: '' },
  { date: '2026-07-24', worker_id: 'WRK-106', worker_name: 'Priya Dharshini', phone_number: '9876543106', route_id: 'RT-06', ward: 'Ward-3', covered: 'No', complaints_received: 9, remarks: 'Festival crowd blocked access' },
  { date: '2026-07-24', worker_id: 'WRK-107', worker_name: 'Karthik Raja', phone_number: '9876543107', route_id: 'RT-07', ward: 'Ward-4', covered: 'Yes', complaints_received: 0, remarks: 'Normal round' },
  { date: '2026-07-24', worker_id: 'WRK-108', worker_name: 'Murugan M.', phone_number: '9876543108', route_id: 'RT-08', ward: 'Ward-4', covered: 'Yes', complaints_received: 0, remarks: 'Completed' },
  { date: '2026-07-24', worker_id: 'WRK-109', worker_name: 'Lakshmi Narayanan', phone_number: '9876543109', route_id: 'RT-09', ward: 'Ward-5', covered: 'No', complaints_received: 3, remarks: 'Hydraulic ramp failure' },
  { date: '2026-07-24', worker_id: 'WRK-110', worker_name: 'Vijay Kumar', phone_number: '9876543110', route_id: 'RT-10', ward: 'Ward-5', covered: 'Yes', complaints_received: 0, remarks: 'Clear' },

  { date: '2026-07-23', worker_id: 'WRK-111', worker_name: 'Deepak Raj', phone_number: '9876543111', route_id: 'RT-11', ward: 'Ward-6', covered: 'No', complaints_received: 15, remarks: 'Crew absent without notice' },
  { date: '2026-07-23', worker_id: 'WRK-112', worker_name: 'Ganesh Nathan', phone_number: '9876543112', route_id: 'RT-12', ward: 'Ward-6', covered: 'Yes', complaints_received: 0, remarks: 'Shift completed' },
  { date: '2026-07-23', worker_id: 'WRK-113', worker_name: 'Manish Verma', phone_number: '9876543113', route_id: 'RT-13', ward: 'Ward-7', covered: 'Yes', complaints_received: 2, remarks: 'Commercial waste heavy' },
  { date: '2026-07-23', worker_id: 'WRK-114', worker_name: 'Saravanan P.', phone_number: '9876543114', route_id: 'RT-14', ward: 'Ward-7', covered: 'No', complaints_received: 10, remarks: 'Tire puncture delay' },
  { date: '2026-07-23', worker_id: 'WRK-115', worker_name: 'Dinesh Karthik', phone_number: '9876543115', route_id: 'RT-15', ward: 'Ward-8', covered: 'Yes', complaints_received: 0, remarks: '' },
  { date: '2026-07-23', worker_id: 'WRK-116', worker_name: 'Balan S.', phone_number: '9876543116', route_id: 'RT-16', ward: 'Ward-8', covered: 'Yes', complaints_received: 0, remarks: 'Good coverage' },
  { date: '2026-07-23', worker_id: 'WRK-117', worker_name: 'Sundar C.', phone_number: '9876543117', route_id: 'RT-17', ward: 'Ward-9', covered: 'No', complaints_received: 6, remarks: 'Waterlogging on main avenue' },
  { date: '2026-07-23', worker_id: 'WRK-118', worker_name: 'Venkatesh Rao', phone_number: '9876543118', route_id: 'RT-18', ward: 'Ward-9', covered: 'Yes', complaints_received: 1, remarks: 'Resident query handled' },
  { date: '2026-07-23', worker_id: 'WRK-199', worker_name: 'Unassigned Worker', phone_number: '', route_id: 'RT-99', ward: 'Ward-99', covered: 'Yes', complaints_received: 0, remarks: 'Isolated test record with no complaints' }, // Awkward case: unlinked/isolated record
  { date: '2026-07-23', worker_id: 'WRK-120', worker_name: 'Arun Prakash', phone_number: '9876543120', route_id: 'RT-20', ward: 'Ward-10', covered: 'Yes', complaints_received: 0, remarks: 'All done' },

  { date: '2026-07-22', worker_id: 'WRK-101', worker_name: 'Ramesh Kumar', phone_number: '9876543101', route_id: 'RT-01', ward: 'Ward-1', covered: 'Yes', complaints_received: 0, remarks: 'Normal' },
  { date: '2026-07-22', worker_id: 'WRK-103', worker_name: 'Suresh K.', phone_number: '9876543103', route_id: 'RT-03', ward: 'Ward-2', covered: 'No', complaints_received: 11, remarks: 'Depot dispatch delay' },
  { date: '2026-07-22', worker_id: 'WRK-105', worker_name: 'Anand Sharma', phone_number: '9876543105', route_id: 'RT-05', ward: 'Ward-3', covered: 'No', complaints_received: 4, remarks: 'Truck undergoing maintenance' },
  { date: '2026-07-22', worker_id: 'WRK-108', worker_name: 'Murugan M.', phone_number: '9876543108', route_id: 'RT-08', ward: 'Ward-4', covered: 'Yes', complaints_received: 0, remarks: 'Completed' },
  { date: '2026-07-22', worker_id: 'WRK-111', worker_name: 'Deepak Raj', phone_number: '9876543111', route_id: 'RT-11', ward: 'Ward-6', covered: 'No', complaints_received: 14, remarks: 'Uncollected bulk waste complaint' },
  { date: '2026-07-22', worker_id: 'WRK-114', worker_name: 'Saravanan P.', phone_number: '9876543114', route_id: 'RT-14', ward: 'Ward-7', covered: 'Yes', complaints_received: 0, remarks: '' },
  { date: '2026-07-22', worker_id: 'WRK-117', worker_name: 'Sundar C.', phone_number: '9876543117', route_id: 'RT-17', ward: 'Ward-9', covered: 'Yes', complaints_received: 0, remarks: 'On schedule' },
  { date: '2026-07-21', worker_id: 'WRK-101', worker_name: 'Ramesh Kumar', phone_number: '9876543101', route_id: 'RT-01', ward: 'Ward-1', covered: 'No', complaints_received: 3, remarks: 'Driver shift conflict' },
  { date: '2026-07-21', worker_id: 'WRK-105', worker_name: 'Anand Sharma', phone_number: '9876543105', route_id: 'RT-05', ward: 'Ward-3', covered: 'Yes', complaints_received: 0, remarks: 'Clean route' },
  { date: '2026-07-21', worker_id: 'WRK-111', worker_name: 'Deepak Raj', phone_number: '9876543111', route_id: 'RT-11', ward: 'Ward-6', covered: 'No', complaints_received: 8, remarks: 'Sanitation strike in pocket B' },
];

function seed(db) {
  const count = db.prepare('SELECT COUNT(*) as count FROM attendance_records').get().count;
  // Re-seed if existing records are under 10 or schema changed
  if (count < 10) {
    db.prepare('DELETE FROM attendance_records').run();
    const insertStmt = db.prepare(`
      INSERT INTO attendance_records (date, worker_id, worker_name, phone_number, route_id, ward, covered, complaints_received, priority_score, remarks)
      VALUES (@date, @worker_id, @worker_name, @phone_number, @route_id, @ward, @covered, @complaints_received, @priority_score, @remarks)
    `);

    const insertMany = db.transaction((records) => {
      for (const record of records) {
        // Calculate priority_score: uncovered routes get 10000 + complaints
        const priority_score = (record.covered === 'No' ? 10000 : 0) + (record.complaints_received || 0);
        insertStmt.run({ ...record, priority_score });
      }
    });

    insertMany(sampleRecords);
    console.log(`Successfully seeded ${sampleRecords.length} Waste Collection Worker Attendance & Route records.`);
  }
}

module.exports = { seed, sampleRecords };
