-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "priority" "public"."TicketPriority" NOT NULL DEFAULT 'LOW';
