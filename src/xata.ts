import { buildClient, getDeployPreviewBranch } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "image",
    checkConstraints: {
      image_xata_id_length_xata_id: {
        name: "image_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_image_xata_id_key: {
        name: "_pgroll_new_image_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "image",
        type: "file",
        file: { defaultPublicAccess: false },
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "name",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: "'Image'::text",
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "tag",
    checkConstraints: {
      tag_xata_id_length_xata_id: {
        name: "tag_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {},
    primaryKey: [],
    uniqueConstraints: {
      _pgroll_new_tag_xata_id_key: {
        name: "_pgroll_new_tag_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "name",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: "'gallery'::text",
        comment: "",
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
  {
    name: "tag-to-image",
    checkConstraints: {
      "tag-to-image_xata_id_length_xata_id": {
        name: "tag-to-image_xata_id_length_xata_id",
        columns: ["xata_id"],
        definition: "CHECK ((length(xata_id) < 256))",
      },
    },
    foreignKeys: {
      fk_image: {
        name: "fk_image",
        columns: ["image"],
        referencedTable: "image",
        referencedColumns: ["xata_id"],
        onDelete: "NO ACTION",
      },
      fk_tag: {
        name: "fk_tag",
        columns: ["tag"],
        referencedTable: "tag",
        referencedColumns: ["xata_id"],
        onDelete: "NO ACTION",
      },
    },
    primaryKey: [],
    uniqueConstraints: {
      "_pgroll_new_tag-to-image_xata_id_key": {
        name: "_pgroll_new_tag-to-image_xata_id_key",
        columns: ["xata_id"],
      },
    },
    columns: [
      {
        name: "image",
        type: "link",
        link: { table: "image" },
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: '{"xata.link":"image"}',
      },
      {
        name: "tag",
        type: "link",
        link: { table: "tag" },
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: '{"xata.link":"tag"}',
      },
      {
        name: "xata_createdat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_id",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: "('rec_'::text || (xata_private.xid())::text)",
        comment: "",
      },
      {
        name: "xata_updatedat",
        type: "datetime",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "xata_version",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: "0",
        comment: "",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Image = InferredTypes["image"];
export type ImageRecord = Image & XataRecord;

export type Tag = InferredTypes["tag"];
export type TagRecord = Tag & XataRecord;

export type TagToImage = InferredTypes["tag-to-image"];
export type TagToImageRecord = TagToImage & XataRecord;

export type DatabaseSchema = {
  image: ImageRecord;
  tag: TagRecord;
  "tag-to-image": TagToImageRecord;
};

const DatabaseClient = buildClient();

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super(
      {
        apiKey: process.env.XATA_API_KEY,
        databaseURL: process.env.XATA_DATABASE_URL,
        // Use deploy preview branch if available, otherwise use branch from environment
        branch:
          getDeployPreviewBranch(process.env) ??
          process.env.XATA_BRANCH ??
          "main",
        ...options,
      },
      tables
    );
  }
}
