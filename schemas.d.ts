import {
  CollectionTypeSchema,
  StringAttribute,
  RequiredAttribute,
  SetMinMaxLength,
  JSONAttribute,
  DefaultTo,
  RelationAttribute,
  DateTimeAttribute,
  PrivateAttribute,
  EmailAttribute,
  UniqueAttribute,
  PasswordAttribute,
  BooleanAttribute,
  EnumerationAttribute,
  BigIntegerAttribute,
  IntegerAttribute,
  DecimalAttribute,
  SetMinMax,
  FloatAttribute,
  TextAttribute,
  MediaAttribute,
  DateAttribute,
  UIDAttribute,
  SingleTypeSchema,
  RichTextAttribute,
  SetPluginOptions,
} from '@strapi/strapi';

export interface AdminPermission extends CollectionTypeSchema {
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: JSONAttribute & DefaultTo<{}>;
    conditions: JSONAttribute & DefaultTo<[]>;
    role: RelationAttribute<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminUser extends CollectionTypeSchema {
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    username: StringAttribute;
    email: EmailAttribute &
      RequiredAttribute &
      PrivateAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    registrationToken: StringAttribute & PrivateAttribute;
    isActive: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    roles: RelationAttribute<'admin::user', 'manyToMany', 'admin::role'> &
      PrivateAttribute;
    blocked: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    preferedLanguage: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminRole extends CollectionTypeSchema {
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    code: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute;
    users: RelationAttribute<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: RelationAttribute<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminApiToken extends CollectionTypeSchema {
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }> &
      DefaultTo<''>;
    type: EnumerationAttribute<['read-only', 'full-access', 'custom']> &
      RequiredAttribute &
      DefaultTo<'read-only'>;
    accessKey: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: DateTimeAttribute;
    permissions: RelationAttribute<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: DateTimeAttribute;
    lifespan: BigIntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminApiTokenPermission extends CollectionTypeSchema {
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    token: RelationAttribute<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFile extends CollectionTypeSchema {
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    alternativeText: StringAttribute;
    caption: StringAttribute;
    width: IntegerAttribute;
    height: IntegerAttribute;
    formats: JSONAttribute;
    hash: StringAttribute & RequiredAttribute;
    ext: StringAttribute;
    mime: StringAttribute & RequiredAttribute;
    size: DecimalAttribute & RequiredAttribute;
    url: StringAttribute & RequiredAttribute;
    previewUrl: StringAttribute;
    provider: StringAttribute & RequiredAttribute;
    provider_metadata: JSONAttribute;
    related: RelationAttribute<'plugin::upload.file', 'morphToMany'>;
    folder: RelationAttribute<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      PrivateAttribute;
    folderPath: StringAttribute &
      RequiredAttribute &
      PrivateAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFolder extends CollectionTypeSchema {
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    pathId: IntegerAttribute & RequiredAttribute & UniqueAttribute;
    parent: RelationAttribute<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginDeeplBatchTranslateJob extends CollectionTypeSchema {
  info: {
    singularName: 'batch-translate-job';
    pluralName: 'batch-translate-jobs';
    displayName: 'DeepL Batch Translate Job';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: StringAttribute;
    sourceLocale: StringAttribute;
    targetLocale: StringAttribute;
    entityIds: JSONAttribute;
    status: EnumerationAttribute<
      [
        'created',
        'setup',
        'running',
        'paused',
        'finished',
        'cancelled',
        'failed'
      ]
    > &
      DefaultTo<'created'>;
    failureReason: JSONAttribute;
    progress: FloatAttribute & DefaultTo<0>;
    autoPublish: BooleanAttribute & DefaultTo<false>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::deepl.batch-translate-job',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::deepl.batch-translate-job',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginSlugifySlug extends CollectionTypeSchema {
  info: {
    singularName: 'slug';
    pluralName: 'slugs';
    displayName: 'slug';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    slug: TextAttribute;
    count: IntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::slugify.slug',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::slugify.slug',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsPermission extends CollectionTypeSchema {
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute & RequiredAttribute;
    role: RelationAttribute<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsRole extends CollectionTypeSchema {
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    description: StringAttribute;
    type: StringAttribute & UniqueAttribute;
    permissions: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsUser extends CollectionTypeSchema {
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    email: EmailAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: StringAttribute;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    confirmationToken: StringAttribute & PrivateAttribute;
    confirmed: BooleanAttribute & DefaultTo<false>;
    blocked: BooleanAttribute & DefaultTo<false>;
    role: RelationAttribute<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    schools: RelationAttribute<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::school.school'
    >;
    school_applications: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::school-application.school-application'
    >;
    picture: MediaAttribute;
    address: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::address.address'
    >;
    firstname: StringAttribute;
    lastname: StringAttribute;
    birthday: DateAttribute;
    gender: EnumerationAttribute<['male', 'female', 'other']>;
    emergency_address: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::address.address'
    >;
    staff_applications: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::staff-application.staff-application'
    >;
    details: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::user-detail.user-detail'
    >;
    middle_names: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginI18NLocale extends CollectionTypeSchema {
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: StringAttribute & UniqueAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginCommentsComment extends CollectionTypeSchema {
  info: {
    tableName: 'plugin-comments-comments';
    singularName: 'comment';
    pluralName: 'comments';
    displayName: 'Comment';
    description: 'Comment content type';
    kind: 'collectionType';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    content: TextAttribute & RequiredAttribute;
    blocked: BooleanAttribute & DefaultTo<false>;
    blockedThread: BooleanAttribute & DefaultTo<false>;
    blockReason: StringAttribute;
    authorUser: RelationAttribute<
      'plugin::comments.comment',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    authorId: StringAttribute;
    authorName: StringAttribute;
    authorEmail: EmailAttribute;
    authorAvatar: StringAttribute;
    isAdminComment: BooleanAttribute;
    removed: BooleanAttribute;
    approvalStatus: StringAttribute;
    related: StringAttribute;
    reports: RelationAttribute<
      'plugin::comments.comment',
      'oneToMany',
      'plugin::comments.comment-report'
    >;
    threadOf: RelationAttribute<
      'plugin::comments.comment',
      'oneToOne',
      'plugin::comments.comment'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::comments.comment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::comments.comment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginCommentsCommentReport extends CollectionTypeSchema {
  info: {
    tableName: 'plugin-comments-reports';
    singularName: 'comment-report';
    pluralName: 'comment-reports';
    displayName: 'Reports';
    description: 'Reports content type';
    kind: 'collectionType';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    content: TextAttribute;
    reason: EnumerationAttribute<['BAD_LANGUAGE', 'DISCRIMINATION', 'OTHER']> &
      RequiredAttribute &
      DefaultTo<'OTHER'>;
    resolved: BooleanAttribute & DefaultTo<false>;
    related: RelationAttribute<
      'plugin::comments.comment-report',
      'manyToOne',
      'plugin::comments.comment'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::comments.comment-report',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::comments.comment-report',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginEmailDesignerEmailTemplate extends CollectionTypeSchema {
  info: {
    singularName: 'email-template';
    pluralName: 'email-templates';
    displayName: 'Email-template';
    name: 'email-template';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
    increments: true;
    comment: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    templateReferenceId: IntegerAttribute & UniqueAttribute;
    design: JSONAttribute;
    name: StringAttribute;
    subject: StringAttribute;
    bodyHtml: TextAttribute;
    bodyText: TextAttribute;
    enabled: BooleanAttribute & DefaultTo<true>;
    tags: JSONAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::email-designer.email-template',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::email-designer.email-template',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginStrapiStripeSsProduct extends CollectionTypeSchema {
  info: {
    tableName: 'StripeProduct';
    singularName: 'ss-product';
    pluralName: 'ss-products';
    displayName: 'Product';
    description: 'Stripe Products';
    kind: 'collectionType';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    title: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    slug: UIDAttribute<'plugin::strapi-stripe.ss-product', 'title'> &
      RequiredAttribute &
      UniqueAttribute;
    description: TextAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    price: DecimalAttribute & RequiredAttribute;
    currency: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    productImage: MediaAttribute & RequiredAttribute;
    isSubscription: BooleanAttribute & DefaultTo<false>;
    interval: StringAttribute;
    trialPeriodDays: IntegerAttribute;
    stripeProductId: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 3;
      }>;
    stripePriceId: StringAttribute &
      SetMinMax<{
        min: 3;
      }>;
    stripePlanId: StringAttribute &
      SetMinMax<{
        min: 3;
      }>;
    stripePayment: RelationAttribute<
      'plugin::strapi-stripe.ss-product',
      'oneToMany',
      'plugin::strapi-stripe.ss-payment'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::strapi-stripe.ss-product',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::strapi-stripe.ss-product',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginStrapiStripeSsPayment extends CollectionTypeSchema {
  info: {
    tableName: 'StripePayment';
    singularName: 'ss-payment';
    pluralName: 'ss-payments';
    displayName: 'Payment';
    description: 'Stripe Payment';
    kind: 'collectionType';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    txnDate: DateTimeAttribute & RequiredAttribute;
    transactionId: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        maxLength: 250;
      }>;
    isTxnSuccessful: BooleanAttribute & DefaultTo<false>;
    txnMessage: TextAttribute &
      SetMinMaxLength<{
        maxLength: 5000;
      }>;
    txnErrorMessage: StringAttribute &
      SetMinMaxLength<{
        maxLength: 250;
      }>;
    txnAmount: DecimalAttribute & RequiredAttribute;
    customerName: StringAttribute & RequiredAttribute;
    customerEmail: StringAttribute & RequiredAttribute;
    stripeProduct: RelationAttribute<
      'plugin::strapi-stripe.ss-payment',
      'manyToOne',
      'plugin::strapi-stripe.ss-product'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::strapi-stripe.ss-payment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::strapi-stripe.ss-payment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiAboutPageAboutPage extends SingleTypeSchema {
  info: {
    singularName: 'about-page';
    pluralName: 'about-pages';
    displayName: 'AboutPage';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    content: RichTextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::about-page.about-page',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::about-page.about-page',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::about-page.about-page',
      'oneToMany',
      'api::about-page.about-page'
    >;
    locale: StringAttribute;
  };
}

export interface ApiAddressAddress extends CollectionTypeSchema {
  info: {
    singularName: 'address';
    pluralName: 'addresses';
    displayName: 'Address';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    firstname: StringAttribute;
    lastname: StringAttribute;
    street: StringAttribute;
    number: StringAttribute;
    city: StringAttribute;
    country: StringAttribute;
    postalCode: IntegerAttribute;
    user: RelationAttribute<
      'api::address.address',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::address.address',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::address.address',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiAnswerAnswer extends CollectionTypeSchema {
  info: {
    singularName: 'answer';
    pluralName: 'answers';
    displayName: 'Answer';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    answer: TextAttribute;
    school_application: RelationAttribute<
      'api::answer.answer',
      'manyToOne',
      'api::school-application.school-application'
    >;
    question: RelationAttribute<
      'api::answer.answer',
      'oneToOne',
      'api::question.question'
    >;
    staff_application: RelationAttribute<
      'api::answer.answer',
      'manyToOne',
      'api::staff-application.staff-application'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::answer.answer',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::answer.answer',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiImpressumImpressum extends SingleTypeSchema {
  info: {
    singularName: 'impressum';
    pluralName: 'impressums';
    displayName: 'Impressum';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    content: RichTextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::impressum.impressum',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::impressum.impressum',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::impressum.impressum',
      'oneToMany',
      'api::impressum.impressum'
    >;
    locale: StringAttribute;
  };
}

export interface ApiPageContentPageContent extends SingleTypeSchema {
  info: {
    singularName: 'page-content';
    pluralName: 'page-contents';
    displayName: 'PageContent';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    navbar_brand: MediaAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    showcase: MediaAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    showcaseTitle: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    showcaseSubtitle: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    contact: TextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    facebookLink: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    twitterLink: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    instagramLink: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::page-content.page-content',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::page-content.page-content',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::page-content.page-content',
      'oneToMany',
      'api::page-content.page-content'
    >;
    locale: StringAttribute;
  };
}

export interface ApiPrivacyPrivacy extends SingleTypeSchema {
  info: {
    singularName: 'privacy';
    pluralName: 'privacies';
    displayName: 'Privacy';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    content: RichTextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::privacy.privacy',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::privacy.privacy',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::privacy.privacy',
      'oneToMany',
      'api::privacy.privacy'
    >;
    locale: StringAttribute;
  };
}

export interface ApiQuestionQuestion extends CollectionTypeSchema {
  info: {
    singularName: 'question';
    pluralName: 'questions';
    displayName: 'Question';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    collection: RelationAttribute<
      'api::question.question',
      'manyToOne',
      'api::question-collection.question-collection'
    >;
    required: BooleanAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      DefaultTo<false>;
    type: RelationAttribute<
      'api::question.question',
      'oneToOne',
      'api::question-type.question-type'
    >;
    order: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      SetMinMax<{
        min: 0;
        max: 250;
      }> &
      DefaultTo<0>;
    inputType: EnumerationAttribute<['text', 'bool', 'longtext']> &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      DefaultTo<'text'>;
    question: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::question.question',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::question.question',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::question.question',
      'oneToMany',
      'api::question.question'
    >;
    locale: StringAttribute;
  };
}

export interface ApiQuestionCollectionQuestionCollection
  extends CollectionTypeSchema {
  info: {
    singularName: 'question-collection';
    pluralName: 'question-collections';
    displayName: 'QuestionCollection';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: StringAttribute;
    questions: RelationAttribute<
      'api::question-collection.question-collection',
      'oneToMany',
      'api::question.question'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::question-collection.question-collection',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::question-collection.question-collection',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiQuestionTypeQuestionType extends CollectionTypeSchema {
  info: {
    singularName: 'question-type';
    pluralName: 'question-types';
    displayName: 'QuestionType';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    description: RichTextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    order: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      DefaultTo<0>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::question-type.question-type',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::question-type.question-type',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::question-type.question-type',
      'oneToMany',
      'api::question-type.question-type'
    >;
    locale: StringAttribute;
  };
}

export interface ApiReferenceReference extends CollectionTypeSchema {
  info: {
    singularName: 'reference';
    pluralName: 'references';
    displayName: 'Reference';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: StringAttribute;
    relation: StringAttribute;
    email: EmailAttribute;
    emailSend: BooleanAttribute & DefaultTo<false>;
    submitted: BooleanAttribute & DefaultTo<false>;
    answers: RelationAttribute<
      'api::reference.reference',
      'oneToMany',
      'api::answer.answer'
    >;
    url: StringAttribute;
    uid: UIDAttribute & RequiredAttribute;
    applicant: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::reference.reference',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::reference.reference',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiSchoolSchool extends CollectionTypeSchema {
  info: {
    singularName: 'school';
    pluralName: 'schools';
    displayName: 'Schools';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: UIDAttribute<'api::school.school', 'name'>;
    description: TextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    isPublic: BooleanAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      DefaultTo<false>;
    acceptingStudents: BooleanAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      DefaultTo<false>;
    schoolFee: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    applicationFee: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    startDate: DateAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    endDate: DateAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    image: MediaAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    students: RelationAttribute<
      'api::school.school',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    staff: RelationAttribute<
      'api::school.school',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    applications: RelationAttribute<
      'api::school.school',
      'oneToMany',
      'api::school-application.school-application'
    >;
    applicationQuestions: RelationAttribute<
      'api::school.school',
      'oneToOne',
      'api::question-collection.question-collection'
    >;
    preApplicationText: RichTextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    referenceQuestions: RelationAttribute<
      'api::school.school',
      'oneToOne',
      'api::question-collection.question-collection'
    >;
    secondarySchool: BooleanAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      DefaultTo<false>;
    contactEmail: EmailAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    stripeAppFeeId: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    stripeSchoolFeeId: IntegerAttribute &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    detailedDescription: RichTextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    currency: EnumerationAttribute<['EUR', 'GBP', 'USD']> &
      SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      DefaultTo<'USD'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::school.school',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::school.school',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::school.school',
      'oneToMany',
      'api::school.school'
    >;
    locale: StringAttribute;
  };
}

export interface ApiSchoolApplicationSchoolApplication
  extends CollectionTypeSchema {
  info: {
    singularName: 'school-application';
    pluralName: 'school-applications';
    displayName: 'SchoolApplication';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    school: RelationAttribute<
      'api::school-application.school-application',
      'manyToOne',
      'api::school.school'
    >;
    user: RelationAttribute<
      'api::school-application.school-application',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    answers: RelationAttribute<
      'api::school-application.school-application',
      'oneToMany',
      'api::answer.answer'
    >;
    state: EnumerationAttribute<
      ['created', 'submitted', 'reviewed', 'approved', 'revoked']
    > &
      DefaultTo<'created'>;
    step: IntegerAttribute & DefaultTo<0>;
    reference1: RelationAttribute<
      'api::school-application.school-application',
      'oneToOne',
      'api::reference.reference'
    >;
    reference2: RelationAttribute<
      'api::school-application.school-application',
      'oneToOne',
      'api::reference.reference'
    >;
    applicationFeePaid: BooleanAttribute & DefaultTo<false>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::school-application.school-application',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::school-application.school-application',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiStaffApplicationStaffApplication
  extends CollectionTypeSchema {
  info: {
    singularName: 'staff-application';
    pluralName: 'staff-applications';
    displayName: 'StaffApplication';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    arriveAt: DateAttribute;
    stayUntil: DateAttribute;
    answers: RelationAttribute<
      'api::staff-application.staff-application',
      'oneToMany',
      'api::answer.answer'
    >;
    state: EnumerationAttribute<
      ['created', 'submitted', 'reviewed', 'approved', 'revoked']
    > &
      DefaultTo<'created'>;
    submittedAt: DateTimeAttribute;
    user: RelationAttribute<
      'api::staff-application.staff-application',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    reference1: RelationAttribute<
      'api::staff-application.staff-application',
      'oneToOne',
      'api::reference.reference'
    >;
    reference2: RelationAttribute<
      'api::staff-application.staff-application',
      'oneToOne',
      'api::reference.reference'
    >;
    step: IntegerAttribute &
      SetMinMax<{
        min: 0;
        max: 4;
      }> &
      DefaultTo<0>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::staff-application.staff-application',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::staff-application.staff-application',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiStaffApplicationSettingStaffApplicationSetting
  extends SingleTypeSchema {
  info: {
    singularName: 'staff-application-setting';
    pluralName: 'staff-application-settings';
    displayName: 'StaffApplicationSetting';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    questions: RelationAttribute<
      'api::staff-application-setting.staff-application-setting',
      'oneToOne',
      'api::question-collection.question-collection'
    >;
    cardImage: MediaAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    shortDescription: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    details: RichTextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    allowApplications: BooleanAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    referenceQuestions: RelationAttribute<
      'api::staff-application-setting.staff-application-setting',
      'oneToOne',
      'api::question-collection.question-collection'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::staff-application-setting.staff-application-setting',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::staff-application-setting.staff-application-setting',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::staff-application-setting.staff-application-setting',
      'oneToMany',
      'api::staff-application-setting.staff-application-setting'
    >;
    locale: StringAttribute;
  };
}

export interface ApiUserDetailUserDetail extends CollectionTypeSchema {
  info: {
    singularName: 'user-detail';
    pluralName: 'user-details';
    displayName: 'UserDetail';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    phone: StringAttribute;
    mobile_phone: StringAttribute;
    nationality: StringAttribute;
    native_language: StringAttribute;
    language2: StringAttribute;
    language3: StringAttribute;
    language2_skills: StringAttribute;
    language3_skills: StringAttribute;
    user: RelationAttribute<
      'api::user-detail.user-detail',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::user-detail.user-detail',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::user-detail.user-detail',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

declare global {
  namespace Strapi {
    interface Schemas {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::deepl.batch-translate-job': PluginDeeplBatchTranslateJob;
      'plugin::slugify.slug': PluginSlugifySlug;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::comments.comment': PluginCommentsComment;
      'plugin::comments.comment-report': PluginCommentsCommentReport;
      'plugin::email-designer.email-template': PluginEmailDesignerEmailTemplate;
      'plugin::strapi-stripe.ss-product': PluginStrapiStripeSsProduct;
      'plugin::strapi-stripe.ss-payment': PluginStrapiStripeSsPayment;
      'api::about-page.about-page': ApiAboutPageAboutPage;
      'api::address.address': ApiAddressAddress;
      'api::answer.answer': ApiAnswerAnswer;
      'api::impressum.impressum': ApiImpressumImpressum;
      'api::page-content.page-content': ApiPageContentPageContent;
      'api::privacy.privacy': ApiPrivacyPrivacy;
      'api::question.question': ApiQuestionQuestion;
      'api::question-collection.question-collection': ApiQuestionCollectionQuestionCollection;
      'api::question-type.question-type': ApiQuestionTypeQuestionType;
      'api::reference.reference': ApiReferenceReference;
      'api::school.school': ApiSchoolSchool;
      'api::school-application.school-application': ApiSchoolApplicationSchoolApplication;
      'api::staff-application.staff-application': ApiStaffApplicationStaffApplication;
      'api::staff-application-setting.staff-application-setting': ApiStaffApplicationSettingStaffApplicationSetting;
      'api::user-detail.user-detail': ApiUserDetailUserDetail;
    }
  }
}
