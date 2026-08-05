// server/src/index.ts
import express3 from "express";
import cors from "cors";

// server/src/routes/customerRoutes.ts
import { Router } from "express";

// server/src/controllers/customerController.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
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
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customers" });
  }
};
var getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
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
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customer" });
  }
};
var createCustomer = async (req, res) => {
  try {
    const { name, code, type, industry, websiteUrl, studentPortalUrl, teacherPortalUrl } = req.body;
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        code,
        type,
        industry,
        websiteUrl,
        studentPortalUrl,
        teacherPortalUrl,
        status: "Active",
        contractStatus: "Draft",
        accountManager: "Unassigned",
        customerSuccessManager: "Unassigned",
        supportOwner: "Unassigned",
        healthScore: "Neutral",
        contractStartDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        contractEndDate: new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() + 1)).toISOString().split("T")[0],
        subscriptionType: "Standard"
      }
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: "Error creating customer" });
  }
};
var updateAccountTeam = async (req, res) => {
  try {
    const { accountManager, customerSuccessManager, supportOwner } = req.body;
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { accountManager, customerSuccessManager, supportOwner }
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error updating account team" });
  }
};
var createResource = async (req, res) => {
  try {
    const { title, type, url } = req.body;
    const resource = await prisma.customerResource.create({
      data: { customerId: req.params.id, title, type, url }
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: "Error creating resource" });
  }
};
var deleteResource = async (req, res) => {
  try {
    await prisma.customerResource.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting resource" });
  }
};
var uploadResource = async (req, res) => {
  try {
    const { title, type } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const resource = await prisma.customerResource.create({
      data: { customerId: req.params.id, title, type, url: fileUrl }
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: "Error uploading resource" });
  }
};
var updatePortals = async (req, res) => {
  try {
    const { websiteUrl, studentPortalUrl, teacherPortalUrl } = req.body;
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { websiteUrl, studentPortalUrl, teacherPortalUrl }
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error updating portal links" });
  }
};
var createContact = async (req, res) => {
  try {
    const { name, jobTitle, email, phone, isPrimary, schoolId } = req.body;
    const contact = await prisma.contact.create({
      data: { customerId: req.params.id, name, jobTitle, email, phone, isPrimary, schoolId }
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: "Error creating contact" });
  }
};
var deleteContact = async (req, res) => {
  try {
    await prisma.contact.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
    });
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting contact" });
  }
};
var updateContact = async (req, res) => {
  try {
    const { name, jobTitle, email, phone, isPrimary } = req.body;
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { name, jobTitle, email, phone, isPrimary }
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: "Error updating contact" });
  }
};
var createSchool = async (req, res) => {
  try {
    const { code, name, educationalStage, city, status, studentPortalUrl, teacherPortalUrl, coordinatorName, coordinatorPhone, coordinatorEmail } = req.body;
    const school = await prisma.school.create({
      data: { customerId: req.params.id, code, name, educationalStage, city, status, studentPortalUrl, teacherPortalUrl }
    });
    if (coordinatorName) {
      await prisma.contact.create({
        data: {
          customerId: req.params.id,
          schoolId: school.id,
          name: coordinatorName,
          jobTitle: "Coordinator",
          phone: coordinatorPhone || "",
          email: coordinatorEmail || "",
          isPrimary: true
        }
      });
    }
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ error: "Error creating school" });
  }
};
var updateSchool = async (req, res) => {
  try {
    const { code, name, educationalStage, city, status, studentPortalUrl, teacherPortalUrl } = req.body;
    const school = await prisma.school.update({
      where: { id: req.params.id },
      data: { code, name, educationalStage, city, status, studentPortalUrl, teacherPortalUrl }
    });
    res.json(school);
  } catch (error) {
    res.status(500).json({ error: "Error updating school" });
  }
};
var getMeetings = async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({ where: { isDeleted: false }, include: { customer: true } });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching meetings" });
  }
};
var createMeeting = async (req, res) => {
  try {
    const { title, type, date, status, organizer } = req.body;
    const meeting = await prisma.meeting.create({
      data: { customerId: req.params.id, title, type, date, status, organizer }
    });
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: "Error creating meeting" });
  }
};
var getRenewals = async (req, res) => {
  try {
    const renewals = await prisma.renewal.findMany({ where: { isDeleted: false }, include: { customer: true } });
    res.json(renewals);
  } catch (error) {
    res.status(500).json({ error: "Error fetching renewals" });
  }
};
var createRenewal = async (req, res) => {
  try {
    const { renewalDate, status, owner } = req.body;
    const renewal = await prisma.renewal.create({
      data: { customerId: req.params.id, renewalDate, status, owner }
    });
    res.status(201).json(renewal);
  } catch (error) {
    res.status(500).json({ error: "Error creating renewal" });
  }
};
var softDeleteCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customer" });
  }
};
var getRecycleBin = async (req, res) => {
  try {
    const deletedCustomers = await prisma.customer.findMany({
      where: { isDeleted: true },
      include: { environments: true, tasks: true }
    });
    res.json(deletedCustomers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recycle bin" });
  }
};
var restoreCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { isDeleted: false, deletedAt: null }
    });
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: "Error restoring customer" });
  }
};
var hardDeleteCustomer = async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id }
    });
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
router.post("/customers", createCustomer);
router.get("/customers/:id", getCustomerById);
router.patch("/customers/:id/team", updateAccountTeam);
router.patch("/customers/:id/portals", updatePortals);
router.delete("/customers/:id", softDeleteCustomer);
router.patch("/customers/:id/restore", restoreCustomer);
router.delete("/customers/:id/hard", hardDeleteCustomer);
router.post("/customers/:id/contacts", createContact);
router.delete("/contacts/:id", deleteContact);
router.patch("/contacts/:id", updateContact);
router.post("/customers/:id/schools", createSchool);
router.patch("/schools/:id", updateSchool);
router.post("/customers/:id/resources", createResource);
router.post("/customers/:id/resources/upload", upload.single("file"), uploadResource);
router.delete("/resources/:id", deleteResource);
router.get("/meetings", getMeetings);
router.post("/customers/:id/meetings", createMeeting);
router.get("/renewals", getRenewals);
router.post("/customers/:id/renewals", createRenewal);
var customerRoutes_default = router;

// server/src/routes/environmentRoutes.ts
import { Router as Router2 } from "express";

// server/src/controllers/environmentController.ts
import { PrismaClient as PrismaClient2 } from "@prisma/client";
var prisma2 = new PrismaClient2();
var getEnvironments = async (req, res) => {
  try {
    const environments = await prisma2.environment.findMany({
      where: { isDeleted: false },
      include: { certificates: { where: { isDeleted: false } }, customer: true }
    });
    res.json(environments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching environments" });
  }
};
var getEnvironmentById = async (req, res) => {
  try {
    const environment = await prisma2.environment.findUnique({
      where: { id: req.params.id },
      include: { certificates: { where: { isDeleted: false } }, customer: true }
    });
    if (!environment || environment.isDeleted) return res.status(404).json({ error: "Environment not found" });
    res.json(environment);
  } catch (error) {
    res.status(500).json({ error: "Error fetching environment details" });
  }
};
var createEnvironment = async (req, res) => {
  try {
    const { name, type, url, ipAddress, dbVersion, appVersion, status, lastDeployment, pedDate } = req.body;
    const env = await prisma2.environment.create({
      data: { customerId: req.params.id, name, type, url, ipAddress, dbVersion, appVersion, status, lastDeployment, pedDate }
    });
    res.status(201).json(env);
  } catch (error) {
    res.status(500).json({ error: "Error creating environment" });
  }
};
var updateEnvironment = async (req, res) => {
  try {
    const { name, type, url, ipAddress, dbVersion, appVersion, status, lastDeployment, pedDate } = req.body;
    const env = await prisma2.environment.update({
      where: { id: req.params.id },
      data: { name, type, url, ipAddress, dbVersion, appVersion, status, lastDeployment, pedDate }
    });
    res.json(env);
  } catch (error) {
    res.status(500).json({ error: "Error updating environment" });
  }
};
var deleteEnvironment = async (req, res) => {
  try {
    await prisma2.environment.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting environment" });
  }
};
var createCertificate = async (req, res) => {
  try {
    const { domain, issuer, validFrom, validTo, status } = req.body;
    const cert = await prisma2.certificate.create({
      data: { environmentId: req.params.id, domain, issuer, validFrom, validTo, status }
    });
    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ error: "Error creating certificate" });
  }
};
var updateCertificate = async (req, res) => {
  try {
    const { domain, issuer, validFrom, validTo, status } = req.body;
    const cert = await prisma2.certificate.update({
      where: { id: req.params.id },
      data: { domain, issuer, validFrom, validTo, status }
    });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: "Error updating certificate" });
  }
};
var deleteCertificate = async (req, res) => {
  try {
    await prisma2.certificate.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting certificate" });
  }
};

// server/src/routes/environmentRoutes.ts
var router2 = Router2();
router2.get("/environments", getEnvironments);
router2.get("/environments/:id", getEnvironmentById);
router2.post("/customers/:id/environments", createEnvironment);
router2.patch("/environments/:id", updateEnvironment);
router2.delete("/environments/:id", deleteEnvironment);
router2.post("/environments/:id/certificates", createCertificate);
router2.patch("/certificates/:id", updateCertificate);
router2.delete("/certificates/:id", deleteCertificate);
var environmentRoutes_default = router2;

// server/src/routes/authRoutes.ts
import { Router as Router3 } from "express";

// server/src/controllers/authController.ts
import { PrismaClient as PrismaClient3 } from "@prisma/client";
var prisma3 = new PrismaClient3();
var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma3.user.findUnique({
      where: { email },
      include: { permissions: true }
    });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ error: "Login error" });
  }
};
var getUsers = async (req, res) => {
  try {
    const users = await prisma3.user.findMany({
      include: { permissions: true }
    });
    const safeUsers = users.map((u) => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};
var createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma3.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const user = await prisma3.user.create({
      data: { name, email, password, role }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};
var updatePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const userId = req.params.id;
    await prisma3.permission.deleteMany({ where: { userId } });
    if (permissions && permissions.length > 0) {
      await prisma3.permission.createMany({
        data: permissions.map((p) => ({
          userId,
          moduleName: p.moduleName,
          canRead: p.canRead,
          canWrite: p.canWrite
        }))
      });
    }
    const updatedUser = await prisma3.user.findUnique({
      where: { id: userId },
      include: { permissions: true }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating permissions" });
  }
};
var getNotifications = async (req, res) => {
  try {
    const notifications = await prisma3.notification.findMany({
      where: { userId: req.params.id },
      orderBy: { createdAt: "desc" },
      take: 20
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
};
var markNotificationRead = async (req, res) => {
  try {
    const notification = await prisma3.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Error marking notification as read" });
  }
};

// server/src/routes/authRoutes.ts
var router3 = Router3();
router3.post("/login", login);
router3.get("/users", getUsers);
router3.post("/users", createUser);
router3.patch("/users/:id/permissions", updatePermissions);
router3.get("/users/:id/notifications", getNotifications);
router3.patch("/notifications/:id/read", markNotificationRead);
var authRoutes_default = router3;

// server/src/routes/statsRoutes.ts
import { Router as Router4 } from "express";

// server/src/controllers/statsController.ts
import { PrismaClient as PrismaClient4 } from "@prisma/client";
var prisma4 = new PrismaClient4();
var getStats = async (req, res) => {
  try {
    const customerCount = await prisma4.customer.count({ where: { isDeleted: false } });
    const envCount = await prisma4.environment.count({ where: { isDeleted: false, customer: { isDeleted: false } } });
    const activeTickets = await prisma4.jiraTicket.count({ where: { isDeleted: false, status: { not: "Done" }, customer: { isDeleted: false } } });
    const pendingTasks = await prisma4.task.count({ where: { isDeleted: false, status: { not: "Completed" }, customer: { isDeleted: false } } });
    const userCount = 42500;
    const questionsCount = 15420;
    const examsCount = 385;
    res.json({ customerCount, envCount, activeTickets, pendingTasks, userCount, questionsCount, examsCount });
  } catch (error) {
    res.status(500).json({ error: "Error fetching stats" });
  }
};
var search = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json({ customers: [], schools: [] });
    const customers = await prisma4.customer.findMany({
      where: {
        isDeleted: false,
        OR: [
          { name: { contains: query } },
          { code: { contains: query } }
        ]
      },
      take: 5
    });
    const schools = await prisma4.school.findMany({
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
    res.json({ customers, schools });
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
import express2 from "express";

// server/src/controllers/taskController.ts
import express from "express";
import { PrismaClient as PrismaClient5 } from "@prisma/client";
var { Request, Response } = express;
var prisma5 = new PrismaClient5();
var getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma5.task.findMany({ where: { isDeleted: false }, include: { customer: true } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};
var createTask = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { title, priority, status, dueDate, assignee } = req.body;
    let assigneeName = assignee;
    const user = await prisma5.user.findUnique({ where: { id: assignee } });
    if (user) {
      assigneeName = user.name;
      await prisma5.notification.create({
        data: {
          userId: user.id,
          message: `You were assigned to a Success Task: ${title}`,
          link: `/customers/${customerId || req.body.customerId}`
        }
      });
    }
    const task = await prisma5.task.create({
      data: {
        customerId: customerId || req.body.customerId,
        title,
        priority,
        status,
        dueDate,
        assignee: assigneeName
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating task" });
  }
};
var updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await prisma5.task.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error updating task status" });
  }
};
var deleteTask = async (req, res) => {
  try {
    await prisma5.task.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};

// server/src/routes/taskRoutes.ts
var { Router: Router5 } = express2;
var router5 = Router5();
router5.get("/tasks", getAllTasks);
router5.post("/customers/:customerId/tasks", createTask);
router5.post("/tasks", createTask);
router5.patch("/tasks/:id", updateTaskStatus);
router5.delete("/tasks/:id", deleteTask);
var taskRoutes_default = router5;

// server/src/routes/ticketRoutes.ts
import { Router as Router6 } from "express";

// server/src/controllers/ticketController.ts
import { PrismaClient as PrismaClient6 } from "@prisma/client";
var prisma6 = new PrismaClient6();
var getJiraTickets = async (req, res) => {
  try {
    const tickets = await prisma6.jiraTicket.findMany({
      where: { isDeleted: false },
      include: { customer: true }
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Jira tickets" });
  }
};
var createJiraTicket = async (req, res) => {
  try {
    const { ticketId, title, type, status, priority, assignee, customerId } = req.body;
    let assigneeName = assignee;
    const user = await prisma6.user.findUnique({ where: { id: assignee } });
    if (user) {
      assigneeName = user.name;
      await prisma6.notification.create({
        data: {
          userId: user.id,
          message: `You were assigned to Ticket ${ticketId}: ${title}`,
          link: `/customers/${customerId}`
        }
      });
    }
    const ticket = await prisma6.jiraTicket.create({
      data: { customerId, ticketId, title, type, status, priority, assignee: assigneeName }
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error creating Jira ticket" });
  }
};
var deleteJiraTicket = async (req, res) => {
  try {
    await prisma6.jiraTicket.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ticket" });
  }
};
var getCustomerTickets = async (req, res) => {
  try {
    const tickets = await prisma6.customerTicket.findMany({
      where: { isDeleted: false },
      include: { customer: true }
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customer tickets" });
  }
};
var createCustomerTicket = async (req, res) => {
  try {
    const { customerId, title, description, link } = req.body;
    let attachmentUrl = link || null;
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }
    const ticket = await prisma6.customerTicket.create({
      data: { customerId, title, description, attachmentUrl, status: "Open" }
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error creating customer ticket" });
  }
};
var deleteCustomerTicket = async (req, res) => {
  try {
    await prisma6.customerTicket.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customer ticket" });
  }
};

// server/src/routes/ticketRoutes.ts
var router6 = Router6();
router6.get("/tickets/jira", getJiraTickets);
router6.post("/customers/:id/tickets/jira", createJiraTicket);
router6.delete("/tickets/jira/:id", deleteJiraTicket);
router6.get("/tickets/support", getCustomerTickets);
router6.post("/customers/:id/tickets/support", upload.single("file"), createCustomerTicket);
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
var app = express3();
var PORT = process.env.PORT || 3e3;
app.use(cors());
app.use(express3.json());
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
