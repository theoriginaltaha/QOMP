// server/src/index.ts
import express2 from "express";
import cors from "cors";

// server/src/routes/customerRoutes.ts
import { Router } from "express";

// server/src/repositories/customerRepository.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var getAllActiveCustomers = async () => {
  return await prisma.customer.findMany({
    where: { isDeleted: false },
    include: {
      environments: { where: { isDeleted: false } },
      contacts: { where: { isDeleted: false } },
      schools: { where: { isDeleted: false } },
      tasks: { where: { isDeleted: false } },
      meetings: { where: { isDeleted: false } },
      renewals: { where: { isDeleted: false } }
    }
  });
};
var getCustomerById = async (id) => {
  return await prisma.customer.findUnique({
    where: { id },
    include: {
      environments: { where: { isDeleted: false } },
      contacts: { where: { isDeleted: false } },
      schools: { where: { isDeleted: false }, include: { contacts: { where: { isDeleted: false } } } },
      tasks: { where: { isDeleted: false } },
      meetings: { where: { isDeleted: false } },
      renewals: { where: { isDeleted: false } },
      resources: { where: { isDeleted: false } },
      jiraTickets: { where: { isDeleted: false } },
      customerTickets: { where: { isDeleted: false } }
    }
  });
};
var createCustomer = async (data) => {
  return await prisma.customer.create({ data });
};
var updateCustomer = async (id, data) => {
  return await prisma.customer.update({ where: { id }, data });
};
var deleteCustomer = async (id) => {
  return await prisma.customer.delete({ where: { id } });
};
var getDeletedCustomers = async () => {
  return await prisma.customer.findMany({
    where: { isDeleted: true },
    include: { environments: true, tasks: true }
  });
};
var createResource = async (data) => {
  return await prisma.customerResource.create({ data });
};
var deleteResource = async (id) => {
  return await prisma.customerResource.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var createContact = async (data) => {
  return await prisma.contact.create({ data });
};
var updateContact = async (id, data) => {
  return await prisma.contact.update({ where: { id }, data });
};
var deleteContact = async (id) => {
  return await prisma.contact.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var createSchool = async (data) => {
  return await prisma.school.create({ data });
};
var updateSchool = async (id, data) => {
  return await prisma.school.update({ where: { id }, data });
};
var getMeetings = async () => {
  return await prisma.meeting.findMany({ where: { isDeleted: false }, include: { customer: true } });
};
var createMeeting = async (data) => {
  return await prisma.meeting.create({ data });
};
var getRenewals = async () => {
  return await prisma.renewal.findMany({ where: { isDeleted: false }, include: { customer: true } });
};
var createRenewal = async (data) => {
  return await prisma.renewal.create({ data });
};

// server/src/services/customerService.ts
var fetchCustomers = async () => {
  return await getAllActiveCustomers();
};
var fetchCustomerById = async (id) => {
  const customer = await getCustomerById(id);
  if (!customer) throw new Error("Customer not found");
  return customer;
};
var createNewCustomer = async (data) => {
  return await createCustomer({
    ...data,
    status: "Active",
    contractStatus: "Draft",
    accountManager: "Unassigned",
    customerSuccessManager: "Unassigned",
    supportOwner: "Unassigned",
    healthScore: "Neutral",
    contractStartDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    contractEndDate: new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() + 1)).toISOString().split("T")[0],
    subscriptionType: "Standard"
  });
};
var updateAccountTeam = async (id, data) => {
  return await updateCustomer(id, data);
};
var addResource = async (customerId, data) => {
  return await createResource({ customerId, ...data });
};
var removeResource = async (id) => {
  return await deleteResource(id);
};
var updatePortals = async (id, data) => {
  return await updateCustomer(id, data);
};
var addContact = async (customerId, data) => {
  return await createContact({ customerId, ...data });
};
var removeContact = async (id) => {
  return await deleteContact(id);
};
var editContact = async (id, data) => {
  return await updateContact(id, data);
};
var addSchool = async (customerId, data) => {
  const school = await createSchool({ customerId, ...data });
  if (data.coordinatorName) {
    await createContact({
      customerId,
      schoolId: school.id,
      name: data.coordinatorName,
      jobTitle: "Coordinator",
      phone: data.coordinatorPhone || "",
      email: data.coordinatorEmail || "",
      isPrimary: true
    });
  }
  return school;
};
var editSchool = async (id, data) => {
  return await updateSchool(id, data);
};
var fetchMeetings = async () => {
  return await getMeetings();
};
var addMeeting = async (customerId, data) => {
  return await createMeeting({ customerId, ...data });
};
var fetchRenewals = async () => {
  return await getRenewals();
};
var addRenewal = async (customerId, data) => {
  return await createRenewal({ customerId, ...data });
};
var softDeleteCustomer = async (id) => {
  return await updateCustomer(id, { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() });
};
var fetchRecycleBin = async () => {
  return await getDeletedCustomers();
};
var restoreCustomer = async (id) => {
  return await updateCustomer(id, { isDeleted: false, deletedAt: null });
};
var hardDeleteCustomer = async (id) => {
  return await deleteCustomer(id);
};

// server/src/controllers/customerController.ts
var getCustomers = async (req, res) => {
  try {
    const customers = await fetchCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customers" });
  }
};
var getCustomerById2 = async (req, res) => {
  try {
    const customer = await fetchCustomerById(req.params.id);
    res.json(customer);
  } catch (error) {
    if (error.message === "Customer not found") return res.status(404).json({ error: error.message });
    res.status(500).json({ error: "Error fetching customer" });
  }
};
var createCustomer2 = async (req, res) => {
  try {
    const customer = await createNewCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error creating customer" });
  }
};
var updateAccountTeam2 = async (req, res) => {
  try {
    const customer = await updateAccountTeam(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error updating account team" });
  }
};
var createResource2 = async (req, res) => {
  try {
    const resource = await addResource(req.params.id, req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: "Error creating resource" });
  }
};
var deleteResource2 = async (req, res) => {
  try {
    await removeResource(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting resource" });
  }
};
var uploadResource = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    const resource = await addResource(req.params.id, { title: req.body.title, type: req.body.type, url: fileUrl });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: "Error uploading resource" });
  }
};
var updatePortals2 = async (req, res) => {
  try {
    const customer = await updatePortals(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error updating portal links" });
  }
};
var createContact2 = async (req, res) => {
  try {
    const contact = await addContact(req.params.id, req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Error creating contact" });
  }
};
var deleteContact2 = async (req, res) => {
  try {
    await removeContact(req.params.id);
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting contact" });
  }
};
var updateContact2 = async (req, res) => {
  try {
    const contact = await editContact(req.params.id, req.body);
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: "Error updating contact" });
  }
};
var createSchool2 = async (req, res) => {
  try {
    const school = await addSchool(req.params.id, req.body);
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ error: "Error creating school" });
  }
};
var updateSchool2 = async (req, res) => {
  try {
    const school = await editSchool(req.params.id, req.body);
    res.json(school);
  } catch (error) {
    res.status(500).json({ error: "Error updating school" });
  }
};
var getMeetings2 = async (req, res) => {
  try {
    const meetings = await fetchMeetings();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching meetings" });
  }
};
var createMeeting2 = async (req, res) => {
  try {
    const meeting = await addMeeting(req.params.id, req.body);
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: "Error creating meeting" });
  }
};
var getRenewals2 = async (req, res) => {
  try {
    const renewals = await fetchRenewals();
    res.json(renewals);
  } catch (error) {
    res.status(500).json({ error: "Error fetching renewals" });
  }
};
var createRenewal2 = async (req, res) => {
  try {
    const renewal = await addRenewal(req.params.id, req.body);
    res.status(201).json(renewal);
  } catch (error) {
    res.status(500).json({ error: "Error creating renewal" });
  }
};
var softDeleteCustomer2 = async (req, res) => {
  try {
    const customer = await softDeleteCustomer(req.params.id);
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customer" });
  }
};
var getRecycleBin = async (req, res) => {
  try {
    const deletedCustomers = await fetchRecycleBin();
    res.json(deletedCustomers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recycle bin" });
  }
};
var restoreCustomer2 = async (req, res) => {
  try {
    const customer = await restoreCustomer(req.params.id);
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: "Error restoring customer" });
  }
};
var hardDeleteCustomer2 = async (req, res) => {
  try {
    await hardDeleteCustomer(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error permanently deleting customer" });
  }
};

// server/src/middlewares/uploadMiddleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";
var uploadDir = process.env.VERCEL ? path.join("/tmp", "uploads") : path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
  // 50MB limit
});

// server/src/routes/customerRoutes.ts
var router = Router();
router.get("/recycle-bin/customers", getRecycleBin);
router.get("/customers", getCustomers);
router.post("/customers", createCustomer2);
router.get("/customers/:id", getCustomerById2);
router.patch("/customers/:id/team", updateAccountTeam2);
router.patch("/customers/:id/portals", updatePortals2);
router.delete("/customers/:id", softDeleteCustomer2);
router.patch("/customers/:id/restore", restoreCustomer2);
router.delete("/customers/:id/hard", hardDeleteCustomer2);
router.post("/customers/:id/contacts", createContact2);
router.delete("/contacts/:id", deleteContact2);
router.patch("/contacts/:id", updateContact2);
router.post("/customers/:id/schools", createSchool2);
router.patch("/schools/:id", updateSchool2);
router.post("/customers/:id/resources", createResource2);
router.post("/customers/:id/resources/upload", upload.single("file"), uploadResource);
router.delete("/resources/:id", deleteResource2);
router.get("/meetings", getMeetings2);
router.post("/customers/:id/meetings", createMeeting2);
router.get("/renewals", getRenewals2);
router.post("/customers/:id/renewals", createRenewal2);
var customerRoutes_default = router;

// server/src/routes/environmentRoutes.ts
import { Router as Router2 } from "express";

// server/src/repositories/environmentRepository.ts
import { PrismaClient as PrismaClient2 } from "@prisma/client";
var prisma2 = new PrismaClient2();
var getAllEnvironments = async () => {
  return await prisma2.environment.findMany({
    where: { isDeleted: false },
    include: { certificates: { where: { isDeleted: false } }, customer: true }
  });
};
var getEnvironmentById = async (id) => {
  return await prisma2.environment.findUnique({
    where: { id },
    include: { certificates: { where: { isDeleted: false } }, customer: true }
  });
};
var createEnvironment = async (data) => {
  return await prisma2.environment.create({ data });
};
var updateEnvironment = async (id, data) => {
  return await prisma2.environment.update({ where: { id }, data });
};
var softDeleteEnvironment = async (id) => {
  return await prisma2.environment.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var createCertificate = async (data) => {
  return await prisma2.certificate.create({ data });
};
var updateCertificate = async (id, data) => {
  return await prisma2.certificate.update({ where: { id }, data });
};
var softDeleteCertificate = async (id) => {
  return await prisma2.certificate.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};

// server/src/services/environmentService.ts
var fetchEnvironments = async () => {
  return await getAllEnvironments();
};
var fetchEnvironmentDetails = async (id) => {
  const env = await getEnvironmentById(id);
  if (!env || env.isDeleted) throw new Error("Environment not found");
  return env;
};
var addEnvironment = async (customerId, data) => {
  return await createEnvironment({
    customerId,
    ...data
  });
};
var editEnvironment = async (id, data) => {
  return await updateEnvironment(id, data);
};
var removeEnvironment = async (id) => {
  return await softDeleteEnvironment(id);
};
var addCertificate = async (environmentId, data) => {
  return await createCertificate({
    environmentId,
    ...data
  });
};
var editCertificate = async (id, data) => {
  return await updateCertificate(id, data);
};
var removeCertificate = async (id) => {
  return await softDeleteCertificate(id);
};

// server/src/controllers/environmentController.ts
var getEnvironments = async (req, res) => {
  try {
    const environments = await fetchEnvironments();
    res.json(environments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching environments" });
  }
};
var getEnvironmentById2 = async (req, res) => {
  try {
    const environment = await fetchEnvironmentDetails(req.params.id);
    res.json(environment);
  } catch (error) {
    if (error.message === "Environment not found") return res.status(404).json({ error: error.message });
    res.status(500).json({ error: "Error fetching environment details" });
  }
};
var createEnvironment2 = async (req, res) => {
  try {
    const env = await addEnvironment(req.params.id, req.body);
    res.status(201).json(env);
  } catch (error) {
    res.status(500).json({ error: "Error creating environment" });
  }
};
var updateEnvironment2 = async (req, res) => {
  try {
    const env = await editEnvironment(req.params.id, req.body);
    res.json(env);
  } catch (error) {
    res.status(500).json({ error: "Error updating environment" });
  }
};
var deleteEnvironment = async (req, res) => {
  try {
    await removeEnvironment(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting environment" });
  }
};
var createCertificate2 = async (req, res) => {
  try {
    const cert = await addCertificate(req.params.id, req.body);
    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ error: "Error creating certificate" });
  }
};
var updateCertificate2 = async (req, res) => {
  try {
    const cert = await editCertificate(req.params.id, req.body);
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: "Error updating certificate" });
  }
};
var deleteCertificate = async (req, res) => {
  try {
    await removeCertificate(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting certificate" });
  }
};

// server/src/routes/environmentRoutes.ts
var router2 = Router2();
router2.get("/environments", getEnvironments);
router2.get("/environments/:id", getEnvironmentById2);
router2.post("/customers/:id/environments", createEnvironment2);
router2.patch("/environments/:id", updateEnvironment2);
router2.delete("/environments/:id", deleteEnvironment);
router2.post("/environments/:id/certificates", createCertificate2);
router2.patch("/certificates/:id", updateCertificate2);
router2.delete("/certificates/:id", deleteCertificate);
var environmentRoutes_default = router2;

// server/src/routes/authRoutes.ts
import { Router as Router3 } from "express";

// server/src/repositories/authRepository.ts
import { PrismaClient as PrismaClient3 } from "@prisma/client";
var prisma3 = new PrismaClient3();
var findUserByEmail = async (email) => {
  return await prisma3.user.findUnique({
    where: { email },
    include: { permissions: true }
  });
};
var findUserById = async (id) => {
  return await prisma3.user.findUnique({
    where: { id },
    include: { permissions: true }
  });
};
var getAllUsers = async () => {
  return await prisma3.user.findMany({
    include: { permissions: true }
  });
};
var createUser = async (data) => {
  return await prisma3.user.create({ data });
};
var deleteUserPermissions = async (userId) => {
  return await prisma3.permission.deleteMany({ where: { userId } });
};
var createUserPermissions = async (permissions) => {
  return await prisma3.permission.createMany({ data: permissions });
};
var getNotificationsByUserId = async (userId) => {
  return await prisma3.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20
  });
};
var updateNotificationReadStatus = async (id, isRead) => {
  return await prisma3.notification.update({
    where: { id },
    data: { isRead }
  });
};

// server/src/services/authService.ts
var loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }
  const { password: _, ...safeUser } = user;
  return safeUser;
};
var fetchAllUsers = async () => {
  const users = await getAllUsers();
  return users.map((u) => {
    const { password, ...safeUser } = u;
    return safeUser;
  });
};
var registerUser = async (data) => {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new Error("Email already exists");
  }
  return await createUser(data);
};
var updateUserPermissions = async (userId, permissions) => {
  await deleteUserPermissions(userId);
  if (permissions && permissions.length > 0) {
    const permissionsData = permissions.map((p) => ({
      userId,
      moduleName: p.moduleName,
      canRead: p.canRead,
      canWrite: p.canWrite
    }));
    await createUserPermissions(permissionsData);
  }
  return await findUserById(userId);
};
var fetchNotifications = async (userId) => {
  return await getNotificationsByUserId(userId);
};
var readNotification = async (notificationId) => {
  return await updateNotificationReadStatus(notificationId, true);
};

// server/src/controllers/authController.ts
var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.json({ user });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Login error" });
  }
};
var getUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};
var createUser2 = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error creating user" });
  }
};
var updatePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const userId = req.params.id;
    const updatedUser = await updateUserPermissions(userId, permissions);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating permissions" });
  }
};
var getNotifications = async (req, res) => {
  try {
    const notifications = await fetchNotifications(req.params.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
};
var markNotificationRead = async (req, res) => {
  try {
    const notification = await readNotification(req.params.id);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Error marking notification as read" });
  }
};

// server/src/routes/authRoutes.ts
var router3 = Router3();
router3.post("/login", login);
router3.get("/users", getUsers);
router3.post("/users", createUser2);
router3.patch("/users/:id/permissions", updatePermissions);
router3.get("/users/:id/notifications", getNotifications);
router3.patch("/notifications/:id/read", markNotificationRead);
var authRoutes_default = router3;

// server/src/routes/statsRoutes.ts
import { Router as Router4 } from "express";

// server/src/repositories/statsRepository.ts
import { PrismaClient as PrismaClient4 } from "@prisma/client";
var prisma4 = new PrismaClient4();
var countActiveCustomers = async () => {
  return await prisma4.customer.count({ where: { isDeleted: false } });
};
var countActiveEnvironments = async () => {
  return await prisma4.environment.count({ where: { isDeleted: false, customer: { isDeleted: false } } });
};
var countActiveJiraTickets = async () => {
  return await prisma4.jiraTicket.count({ where: { isDeleted: false, status: { not: "Done" }, customer: { isDeleted: false } } });
};
var countPendingTasks = async () => {
  return await prisma4.task.count({ where: { isDeleted: false, status: { not: "Completed" }, customer: { isDeleted: false } } });
};
var searchCustomers = async (query) => {
  return await prisma4.customer.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: query } },
        { code: { contains: query } }
      ]
    },
    take: 5
  });
};
var searchSchools = async (query) => {
  return await prisma4.school.findMany({
    where: {
      customer: { isDeleted: false },
      OR: [
        { name: { contains: query } },
        { code: { contains: query } }
      ]
    },
    include: { customer: true },
    take: 5
  });
};

// server/src/services/statsService.ts
var getDashboardStats = async () => {
  const customerCount = await countActiveCustomers();
  const envCount = await countActiveEnvironments();
  const activeTickets = await countActiveJiraTickets();
  const pendingTasks = await countPendingTasks();
  const userCount = 42500;
  const questionsCount = 15420;
  const examsCount = 385;
  return { customerCount, envCount, activeTickets, pendingTasks, userCount, questionsCount, examsCount };
};
var searchEntities = async (query) => {
  if (!query) return { customers: [], schools: [] };
  const customers = await searchCustomers(query);
  const schools = await searchSchools(query);
  return { customers, schools };
};

// server/src/controllers/statsController.ts
var getStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching stats" });
  }
};
var search = async (req, res) => {
  try {
    const query = req.query.q;
    const results = await searchEntities(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Error searching" });
  }
};

// server/src/routes/statsRoutes.ts
var router4 = Router4();
router4.get("/stats", getStats);
router4.get("/search", search);
var statsRoutes_default = router4;

// server/src/routes/taskRoutes.ts
import express from "express";

// server/src/repositories/taskRepository.ts
import { PrismaClient as PrismaClient5 } from "@prisma/client";
var prisma5 = new PrismaClient5();
var getAllActiveTasks = async () => {
  return await prisma5.task.findMany({ where: { isDeleted: false }, include: { customer: true } });
};
var createTask = async (data) => {
  return await prisma5.task.create({ data });
};
var updateTaskStatus = async (id, status) => {
  return await prisma5.task.update({
    where: { id },
    data: { status }
  });
};
var softDeleteTask = async (id) => {
  return await prisma5.task.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var findUserById2 = async (id) => {
  return await prisma5.user.findUnique({ where: { id } });
};
var createNotification = async (data) => {
  return await prisma5.notification.create({ data });
};

// server/src/services/taskService.ts
var fetchAllTasks = async () => {
  return await getAllActiveTasks();
};
var createNewTask = async (taskData) => {
  let assigneeName = taskData.assignee;
  const user = await findUserById2(taskData.assignee);
  if (user) {
    assigneeName = user.name;
    await createNotification({
      userId: user.id,
      message: `You were assigned to a Success Task: ${taskData.title}`,
      link: `/customers/${taskData.customerId}`
    });
  }
  return await createTask({
    customerId: taskData.customerId,
    title: taskData.title,
    priority: taskData.priority,
    status: taskData.status,
    dueDate: taskData.dueDate,
    assignee: assigneeName
  });
};
var changeTaskStatus = async (taskId, status) => {
  return await updateTaskStatus(taskId, status);
};
var removeTask = async (taskId) => {
  return await softDeleteTask(taskId);
};

// server/src/controllers/taskController.ts
var getAllTasks = async (req, res) => {
  try {
    const tasks = await fetchAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};
var createTask2 = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { title, priority, status, dueDate, assignee } = req.body;
    const task = await createNewTask({
      customerId: customerId || req.body.customerId,
      title,
      priority,
      status,
      dueDate,
      assignee
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating task" });
  }
};
var updateTaskStatus2 = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await changeTaskStatus(req.params.id, status);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error updating task status" });
  }
};
var deleteTask = async (req, res) => {
  try {
    await removeTask(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};

// server/src/routes/taskRoutes.ts
var { Router: Router5 } = express;
var router5 = Router5();
router5.get("/tasks", getAllTasks);
router5.post("/customers/:customerId/tasks", createTask2);
router5.post("/tasks", createTask2);
router5.patch("/tasks/:id", updateTaskStatus2);
router5.delete("/tasks/:id", deleteTask);
var taskRoutes_default = router5;

// server/src/routes/ticketRoutes.ts
import { Router as Router6 } from "express";

// server/src/repositories/ticketRepository.ts
import { PrismaClient as PrismaClient6 } from "@prisma/client";
var prisma6 = new PrismaClient6();
var getAllJiraTickets = async () => {
  return await prisma6.jiraTicket.findMany({
    where: { isDeleted: false },
    include: { customer: true }
  });
};
var createJiraTicket = async (data) => {
  return await prisma6.jiraTicket.create({ data });
};
var softDeleteJiraTicket = async (id) => {
  return await prisma6.jiraTicket.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var getAllCustomerTickets = async () => {
  return await prisma6.customerTicket.findMany({
    where: { isDeleted: false },
    include: { customer: true }
  });
};
var createCustomerTicket = async (data) => {
  return await prisma6.customerTicket.create({ data });
};
var softDeleteCustomerTicket = async (id) => {
  return await prisma6.customerTicket.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var findUserById3 = async (id) => {
  return await prisma6.user.findUnique({ where: { id } });
};
var createNotification2 = async (data) => {
  return await prisma6.notification.create({ data });
};

// server/src/services/ticketService.ts
var fetchJiraTickets = async () => {
  return await getAllJiraTickets();
};
var addJiraTicket = async (ticketData) => {
  let assigneeName = ticketData.assignee;
  const user = await findUserById3(ticketData.assignee);
  if (user) {
    assigneeName = user.name;
    await createNotification2({
      userId: user.id,
      message: `You were assigned to Ticket ${ticketData.ticketId}: ${ticketData.title}`,
      link: `/customers/${ticketData.customerId}`
    });
  }
  return await createJiraTicket({
    customerId: ticketData.customerId,
    ticketId: ticketData.ticketId,
    title: ticketData.title,
    type: ticketData.type,
    status: ticketData.status,
    priority: ticketData.priority,
    assignee: assigneeName
  });
};
var removeJiraTicket = async (id) => {
  return await softDeleteJiraTicket(id);
};
var fetchCustomerTickets = async () => {
  return await getAllCustomerTickets();
};
var addCustomerTicket = async (ticketData, file) => {
  let attachmentUrl = ticketData.link || null;
  if (file) {
    attachmentUrl = `/uploads/${file.filename}`;
  }
  return await createCustomerTicket({
    customerId: ticketData.customerId,
    title: ticketData.title,
    description: ticketData.description,
    attachmentUrl,
    status: "Open"
  });
};
var removeCustomerTicket = async (id) => {
  return await softDeleteCustomerTicket(id);
};

// server/src/controllers/ticketController.ts
var getJiraTickets = async (req, res) => {
  try {
    const tickets = await fetchJiraTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Jira tickets" });
  }
};
var createJiraTicket2 = async (req, res) => {
  try {
    const ticket = await addJiraTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error creating Jira ticket" });
  }
};
var deleteJiraTicket = async (req, res) => {
  try {
    await removeJiraTicket(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ticket" });
  }
};
var getCustomerTickets = async (req, res) => {
  try {
    const tickets = await fetchCustomerTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customer tickets" });
  }
};
var createCustomerTicket2 = async (req, res) => {
  try {
    const ticket = await addCustomerTicket(req.body, req.file);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error creating customer ticket" });
  }
};
var deleteCustomerTicket = async (req, res) => {
  try {
    await removeCustomerTicket(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customer ticket" });
  }
};

// server/src/routes/ticketRoutes.ts
var router6 = Router6();
router6.get("/tickets/jira", getJiraTickets);
router6.post("/customers/:id/tickets/jira", createJiraTicket2);
router6.delete("/tickets/jira/:id", deleteJiraTicket);
router6.get("/tickets/support", getCustomerTickets);
router6.post("/customers/:id/tickets/support", upload.single("file"), createCustomerTicket2);
router6.delete("/tickets/support/:id", deleteCustomerTicket);
var ticketRoutes_default = router6;

// server/src/services/sslCronService.ts
import cron from "node-cron";
import { PrismaClient as PrismaClient7 } from "@prisma/client";
var prisma7 = new PrismaClient7();
var initSslCronJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running SSL Expiry Cron Job...");
    try {
      await checkSslCertificates();
    } catch (error) {
      console.error("Error running SSL Expiry Cron Job:", error);
    }
  });
  setTimeout(checkSslCertificates, 5e3);
};
var checkSslCertificates = async () => {
  const certificates = await prisma7.certificate.findMany({
    include: { environment: true }
  });
  const today = /* @__PURE__ */ new Date();
  const admins = await prisma7.user.findMany({
    where: { role: "Admin" }
  });
  if (admins.length === 0) return;
  for (const cert of certificates) {
    if (!cert.validTo) continue;
    const expiryDate = new Date(cert.validTo);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    if (diffDays <= 10 && diffDays >= 0) {
      if (diffDays === 10 || diffDays === 5 || diffDays === 1) {
        for (const admin of admins) {
          await prisma7.notification.create({
            data: {
              userId: admin.id,
              message: `SSL Alert: Certificate for ${cert.domain} (${cert.environment.name}) expires in ${diffDays} days!`,
              link: `/environments/${cert.environment.id}`
            }
          });
        }
      }
    } else if (diffDays < 0) {
      if (cert.status !== "Expired") {
        await prisma7.certificate.update({
          where: { id: cert.id },
          data: { status: "Expired" }
        });
      }
    }
  }
};

// server/src/index.ts
var app = express2();
var PORT = process.env.PORT || 3e3;
app.use(cors());
app.use(express2.json());
if (!process.env.VERCEL) {
}
app.use("/api", authRoutes_default);
app.use("/api", statsRoutes_default);
app.use("/api", customerRoutes_default);
app.use("/api", environmentRoutes_default);
app.use("/api", taskRoutes_default);
app.use("/api", ticketRoutes_default);
if (!process.env.VERCEL) {
  initSslCronJob();
}
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\u{1F680} Full-Stack Backend Server running on http://localhost:${PORT}`);
  });
}
var index_default = app;
export {
  index_default as default
};
