const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

// Display the company logo and load options
function init() {
  const logoText = logo({ name: "IMPACT Employee Manager" }).render();

  console.log(logoText);

  loadOptions();
}

async function loadOptions() {
  const { options } = await prompt([
    {
      type: "list",
      name: "options",
      message: "Please select one of the following options.",
      choices: [
        {
          name: "View All IMPACT Employees",
          value: "LIST_EMPLOYEES"
        },
        {
          name: "View All IMPACT Employees By Department",
          value: "LIST_EE_BY_DEPT"
        },
        {
          name: "View All IMPACT Employees By Manager",
          value: "ListEEbyMgr"
        },
        {
          name: "Add an IMPACT Employee",
          value: "addNewEE"
        },
        {
          name: "Remove an IMPACT Employee",
          value: "deleteEE"
        },
        {
          name: "Update Employee Job Title",
          value: "UPDATE_EE_JOB"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EE_MGR"
        },
        {
          name: "View All Roles",
          value: "VIEW_JOB"
        },
        {
          name: "Add Role",
          value: "ADD_JOB"
        },
        {
          name: "Delete a Job Title",
          value: "DELETE_JOB"
        },
        {
          name: "View All Departments",
          value: "LIST_DEPT"
        },
        {
          name: "Add a New Department",
          value: "ADD_DEPT"
        },
        {
          name: "Delete Department",
          value: "DELETE_DEPT"
        },
        {
          name: "Exit IMPACT Employee Tracker",
          value: "QUIT"
        }
      ]
    }
  ]);

  // Call the function picked by the user 
  switch (options) {
    case "LIST_EMPLOYEES":
      return listEE();
    case "LIST_EE_BY_DEPT":
      return ListEEbyDept();
    case "ListEEbyMgr":
      return listEEbyMgr();
    case "addNewEE":
      return addNewEE();
    case "deleteEE":
      return deleteEE();
    case "UPDATE_EE_JOB":
      return UpdateEEJob();
    case "UPDATE_EE_MGR":
      return UpdateEEmgr();
    case "LIST_DEPT":
      return listDepts();
    case "ADD_DEPT":
      return addDept();
    case "DELETE_DEPT":
      return deleteDept();
    case "VIEW_JOB":
      return listJob();
    case "ADD_JOB":
      return addJob();
    case "DELETE_JOB":
      return removeJob();
    default:
      return quit();
  }
}

async function listEE() {
  const employees = await db.findAllEEs();

  console.log("\n");
  console.table(employees);

  loadOptions();
}

async function ListEEbyDept() {
  const departments = await db.findAllDepts();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see the listed employees?",
      choices: departmentChoices
    }
  ]);

  const employees = await db.findAllEEsByDept(departmentId);

  console.log("\n");
  console.table(employees);

  loadOptions();
}

async function listEEbyMgr() {
  const managers = await db.findAllEEs();

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which manager do you want to see his/her direct reports?",
      choices: managerChoices
    }
  ]);

  const employees = await db.findAllEEsByMgr(managerId);

  console.log("\n");

  if (employees.length === 0) {
    console.log("There are no subordinates reporting to the manager.");
  } else {
    console.table(employees);
  }

  loadOptions();
}

async function deleteEE() {
  const employees = await db.findAllEEs();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to delete?",
      choices: employeeChoices
    }
  ]);

  await db.deleteEE(employeeId);

  console.log("Delete employee from the database");

  loadOptions();
}

async function UpdateEEJob() {
  const employees = await db.findAllEEs();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's job title do you want to update?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllJobs();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which job do you want to assign to the employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEEJob(employeeId, roleId);

  console.log("Updated employee's role");

  loadOptions();
}

async function UpdateEEmgr() {
  const employees = await db.findAllEEs();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's manager do you want to update?",
      choices: employeeChoices
    }
  ]);

  const managers = await db.findAllMgrs(employeeId);

  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message:
        "Which employee do you want to set as a manager?",
      choices: managerChoices
    }
  ]);

  await db.updateEEMgr(employeeId, managerId);

  console.log("Updated employee's manager");

  loadOptions();
}

async function listJob() {
  const roles = await db.findAllJobs();

  console.log("\n");
  console.table(roles);

  loadOptions();
}

async function addJob() {
  const departments = await db.findAllDepts();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the job title?"
    },
    {
      name: "salary",
      message: "What is the salary of the job?"
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department does the employee belong to?",
      choices: departmentChoices
    }
  ]);

  await db.createJob(role);

  console.log(`Added ${role.title} to the database`);

  loadOptions();
}

async function removeJob() {
  const roles = await db.findAllJobs();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message:
        "Which job title do you want to remove?",
      choices: roleChoices
    }
  ]);

  await db.deleteJob(roleId);

  console.log("Removed job title from the database");

  loadOptions();
}

async function listDepts() {
  const departments = await db.findAllDepts();

  console.log("\n");
  console.table(departments);

  loadOptions();
}

async function addDept() {
  const department = await prompt([
    {
      name: "name",
      message: "Please enter the name of the department."
    }
  ]);

  await db.createDept(department);

  console.log(`Added ${department.name} to the database`);

  loadOptions();
}

async function deleteDept() {
  const departments = await db.findAllDepts();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt({
    type: "list",
    name: "departmentId",
    message:
      "Which department would you like to delete?",
    choices: departmentChoices
  });

  await db.removeDepartment(departmentId);

  console.log(`Removed department from the database`);

  loadOptions();
}

async function addNewEE() {
  const roles = await db.findAllJobs();
  const employees = await db.findAllEEs();

  const employee = await prompt([
    {
      name: "first_name",
      message: "Enter the employee's first name."
    },
    {
      name: "last_name",
      message: "Enter the employee's last name."
    }
  ]);

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "Enter the employee's job title.",
    choices: roleChoices
  });

  employee.role_id = roleId;

  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: "None", value: null });

  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Enter the employee's manager.",
    choices: managerChoices
  });

  employee.manager_id = managerId;

  await db.createEE(employee);

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );

  loadOptions();
}

function quit() {
  console.log("You are now leaving.  Thank you for using IMPACT Employee Manager!");
  process.exit();
}
