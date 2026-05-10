-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TRAFFIC_POLICE', 'PUBLIC_USER', 'AMBULANCE', 'FIRE_TRUCK');

-- CreateEnum
CREATE TYPE "SignalColor" AS ENUM ('RED', 'YELLOW', 'GREEN');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "EmergencyType" AS ENUM ('AMBULANCE', 'FIRE', 'POLICE', 'DISASTER');

-- CreateEnum
CREATE TYPE "SystemHealthStatus" AS ENUM ('HEALTHY', 'DEGRADED', 'CRITICAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'PUBLIC_USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Junction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "area" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Junction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrafficLog" (
    "id" TEXT NOT NULL,
    "junctionId" TEXT NOT NULL,
    "vehicleCount" INTEGER NOT NULL,
    "averageSpeedKmph" DOUBLE PRECISION NOT NULL,
    "congestionLevel" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrafficLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrafficPrediction" (
    "id" TEXT NOT NULL,
    "junctionId" TEXT NOT NULL,
    "predictedCongestion" DOUBLE PRECISION NOT NULL,
    "predictedVehicleCount" INTEGER NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "predictedFor" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrafficPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalState" (
    "id" TEXT NOT NULL,
    "junctionId" TEXT NOT NULL,
    "changedById" TEXT,
    "currentColor" "SignalColor" NOT NULL,
    "cycleTimeSec" INTEGER NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignalState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "junctionId" TEXT NOT NULL,
    "reportedById" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyEvent" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT,
    "triggeredById" TEXT,
    "type" "EmergencyType" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyRoute" (
    "id" TEXT NOT NULL,
    "emergencyEventId" TEXT NOT NULL,
    "junctionId" TEXT NOT NULL,
    "routeOrder" INTEGER NOT NULL,
    "etaMinutes" INTEGER NOT NULL,
    "isCleared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemHealthMetric" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "status" "SystemHealthStatus" NOT NULL,
    "cpuUsagePercent" DOUBLE PRECISION NOT NULL,
    "memoryUsagePercent" DOUBLE PRECISION NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "activeSocketClients" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemHealthMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Junction_code_key" ON "Junction"("code");

-- CreateIndex
CREATE INDEX "Junction_area_idx" ON "Junction"("area");

-- CreateIndex
CREATE INDEX "TrafficLog_junctionId_recordedAt_idx" ON "TrafficLog"("junctionId", "recordedAt");

-- CreateIndex
CREATE INDEX "TrafficLog_recordedAt_idx" ON "TrafficLog"("recordedAt");

-- CreateIndex
CREATE INDEX "TrafficPrediction_junctionId_predictedFor_idx" ON "TrafficPrediction"("junctionId", "predictedFor");

-- CreateIndex
CREATE INDEX "SignalState_junctionId_effectiveFrom_idx" ON "SignalState"("junctionId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "Incident_junctionId_status_severity_idx" ON "Incident"("junctionId", "status", "severity");

-- CreateIndex
CREATE INDEX "Incident_occurredAt_idx" ON "Incident"("occurredAt");

-- CreateIndex
CREATE INDEX "EmergencyEvent_type_startedAt_idx" ON "EmergencyEvent"("type", "startedAt");

-- CreateIndex
CREATE INDEX "EmergencyRoute_junctionId_isCleared_idx" ON "EmergencyRoute"("junctionId", "isCleared");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyRoute_emergencyEventId_junctionId_key" ON "EmergencyRoute"("emergencyEventId", "junctionId");

-- CreateIndex
CREATE INDEX "Notification_recipientId_isRead_createdAt_idx" ON "Notification"("recipientId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "SystemHealthMetric_serviceName_recordedAt_idx" ON "SystemHealthMetric"("serviceName", "recordedAt");

-- CreateIndex
CREATE INDEX "SystemHealthMetric_status_recordedAt_idx" ON "SystemHealthMetric"("status", "recordedAt");

-- AddForeignKey
ALTER TABLE "TrafficLog" ADD CONSTRAINT "TrafficLog_junctionId_fkey" FOREIGN KEY ("junctionId") REFERENCES "Junction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficPrediction" ADD CONSTRAINT "TrafficPrediction_junctionId_fkey" FOREIGN KEY ("junctionId") REFERENCES "Junction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignalState" ADD CONSTRAINT "SignalState_junctionId_fkey" FOREIGN KEY ("junctionId") REFERENCES "Junction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignalState" ADD CONSTRAINT "SignalState_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_junctionId_fkey" FOREIGN KEY ("junctionId") REFERENCES "Junction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyEvent" ADD CONSTRAINT "EmergencyEvent_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyEvent" ADD CONSTRAINT "EmergencyEvent_triggeredById_fkey" FOREIGN KEY ("triggeredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyRoute" ADD CONSTRAINT "EmergencyRoute_emergencyEventId_fkey" FOREIGN KEY ("emergencyEventId") REFERENCES "EmergencyEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyRoute" ADD CONSTRAINT "EmergencyRoute_junctionId_fkey" FOREIGN KEY ("junctionId") REFERENCES "Junction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
