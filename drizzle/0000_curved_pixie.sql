CREATE TABLE IF NOT EXISTS "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"cellphone" varchar(256) NOT NULL,
	"telephone" varchar(256),
	"main_address" varchar(256) NOT NULL,
	"second_address" varchar(256),
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"key" varchar(256) NOT NULL,
	"description" varchar(256),
	"budget" numeric NOT NULL,
	"owner" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"state" varchar(256) DEFAULT 'ACTIVE' NOT NULL,
	"status" boolean DEFAULT true,
	CONSTRAINT "project_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"contactInformation" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"phoneNumber" varchar(256),
	"main_address" varchar(256) NOT NULL,
	"second_address" varchar(256),
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "renting" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pty_no" varchar(50) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"area" numeric(10, 2) DEFAULT '0' NOT NULL,
	"expected_rent" numeric(10, 2) DEFAULT '0' NOT NULL,
	"actual_rent" numeric(10, 2) DEFAULT '0' NOT NULL,
	"tenant_info" varchar(256) NOT NULL,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"status" boolean DEFAULT true,
	"emailVerified" timestamp,
	"image" text,
	"role" varchar(256) DEFAULT 'USER',
	"blocked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "warehouse" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar(50) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"provider" varchar(256),
	"project" varchar(256) NOT NULL,
	"batch" varchar(256),
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"date_delivered" date,
	"projects_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_owner_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_projects_id_project_id_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_provider_id_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profiles_first_name_index" ON "profile" ("first_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profiles_last_name_index" ON "profile" ("last_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profiles_cellphone_index" ON "profile" ("cellphone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profiles_telephone_index" ON "profile" ("telephone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_name_index" ON "project" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_key_index" ON "project" ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_budget_index" ON "project" ("budget");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "provider_name_index" ON "provider" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "providers_phonenumber_index" ON "provider" ("phoneNumber");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "renting_name_index" ON "renting" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_index" ON "user" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "warehouse_name_index" ON "warehouse" ("name");