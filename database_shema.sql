CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE category_post(
  id varchar PRIMARY KEY not null,
  category_name varchar not null,
  picture varchar DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER category_post
BEFORE UPDATE ON category_post
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE category_post_id_seq OWNED BY category_post.id;
ALTER sequence category_post_id_seq INCREMENT BY 1; 
ALTER TABLE category_post ALTER COLUMN id SET DEFAULT nextval('category_post_id_seq'::regclass);
CREATE INDEX "index_category_post_id" on category_post(id);
CREATE INDEX "index_category_post_category_name" on category_post(category_name);


CREATE TABLE countries(
  id varchar PRIMARY KEY not null,
  country_name varchar not null,
  devise_code varchar not null default '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER countries
BEFORE UPDATE ON countries
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE countries_id_seq OWNED BY countries.id;
ALTER sequence countries_id_seq INCREMENT BY 1; 

ALTER TABLE countries ALTER COLUMN id SET DEFAULT nextval('countries_id_seq'::regclass);
CREATE INDEX "index_countries_id" on countries(id);
CREATE INDEX "index_countries_country_name" on countries(country_name);

CREATE TABLE payment_methods(
    id varchar PRIMARY KEY not null,
    payment_name varchar not null,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER payment_methods
BEFORE UPDATE ON payment_methods
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE payment_methods_id_seq OWNED BY payment_methods.id;
ALTER sequence payment_methods_id_seq INCREMENT BY 1; 

CREATE INDEX "index_payment_methods_id" on payment_methods(id);
CREATE INDEX "index_payment_payment_name" on payment_methods(payment_name);


CREATE TABLE identifications(
    id varchar PRIMARY KEY not null,
    identification_code varchar,
    country_id varchar,
     created_at TIMESTAMP NOT NULL DEFAULT NOW(),
     updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(identification_code)
      REFERENCES countries(id)
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON identifications
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE identifications_id_seq OWNED BY identifications.id;
ALTER sequence identifications_id_seq INCREMENT BY 1; 
ALTER TABLE identifications ALTER COLUMN id SET DEFAULT nextval('identifications_id_seq'::regclass);

CREATE TABLE type_users(
    id varchar PRIMARY KEY not null,
    name_type_user varchar not null,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON type_users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


CREATE SEQUENCE type_users_id_seq OWNED BY type_users.id;
ALTER sequence type_users_id_seq INCREMENT BY 1; 
ALTER TABLE type_users ALTER COLUMN id SET DEFAULT nextval('type_users_id_seq'::regclass);

CREATE INDEX "index_type_users_name_type_user" on type_users(name_type_user);
CREATE INDEX "index_type_users_id" on type_users(id);



CREATE TABLE role_users (
  id varchar PRIMARY KEY not null,
  role_name varchar not null,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON role_users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


CREATE SEQUENCE role_users_id_seq OWNED BY role_users.id;
ALTER sequence role_users_id_seq INCREMENT BY 1; 
ALTER TABLE role_users ALTER COLUMN id SET DEFAULT nextval('role_users_id_seq'::regclass);

CREATE INDEX "index_role_users_role_name" on role_users(role_name);
CREATE INDEX "index_role_users_id" on role_users(id);

CREATE TABLE users( 
  id varchar PRIMARY KEY not null,
  names varchar not null,
  surnames varchar default '',
  full_name varchar default '',
  prefix_number varchar,
  type_user_id varchar,
  role_user_id varchar,
  enable integer not null DEFAULT 1,
  email varchar not null,
  identification_type_id varchar not null,
  phone_number varchar,
  avatar varchar default '',
  country_id varchar not null,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY(document_type_id)      
          REFERENCES identifications(id),
      FOREIGN KEY (country_id) 
          REFERENCES countries(id),
      FOREIGN KEY (type_user_id)
          REFERENCES type_users(id),
      FOREIGN KEY (role_user_id)
          REFERENCES role_users(id)
);


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE users_id_seq OWNED BY users.id;
ALTER sequence users_id_seq INCREMENT BY 1; 
ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);

CREATE INDEX "index_users_on_email" on users(email);
CREATE INDEX "index_users_on_full_name" on users(full_name);
alter table users  add constraint UQ_personas_email  unique (email);

CREATE TABLE documents(
  id varchar PRIMARY KEY not null,
  pdf_route varchar not null,
  user_id varchar not null,
  document_type_id varchar not  null,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY(user_id)
        REFERENCES users (id),
      FOREIGN KEY (document_type_id)
        REFERENCES identifications(id)

);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


CREATE SEQUENCE documents_id_seq OWNED BY documents.id;
ALTER sequence documents_id_seq INCREMENT BY 1; 
ALTER TABLE documents ALTER COLUMN id SET DEFAULT nextval('documents_id_seq'::regclass);

CREATE INDEX "index_documents_user_id" on documents(user_id);
CREATE INDEX "index_documents_document_type_id" on documents(document_type_id); 
CREATE INDEX "index_documents_pdf_route" on documents(pdf_route);

CREATE TABLE authentications(
  id varchar PRIMARY KEY not null,
  user_id varchar,
  encrypted_password varchar not null default '',
  email varchar,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY(user_id)
     REFERENCES users(id)
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON authentications
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE authentications_id_seq OWNED BY authentications.id;
ALTER sequence authentications_id_seq INCREMENT BY 1; 

ALTER TABLE authentications ALTER COLUMN id SET DEFAULT nextval('authentications_id_seq'::regclass);

CREATE INDEX "index_authentications_users_id" on authentications(user_id);
CREATE INDEX "index_authentications_email" on authentications(email);


CREATE TABLE posts(
  id varchar PRIMARY KEY not null,
  name varchar not null,
  picture varchar DEFAULT '',
  max_amount varchar DEFAULT '',
  min_amount varchar DEFAULT '',
  description varchar DEFAULT '',
  trance_price varchar,
  recive_country_id varchar not null,
  sender_country_id varchar not null,
  category_id varchar not null,
  pay_type_id varchar not null,
  country_id varchar not null,
  user_id varchar not null,
  location varchar not null,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(category_id)
      REFERENCES category_post(id),
    FOREIGN KEY(pay_type_id)
      REFERENCES payment_methods(id),
    FOREIGN KEY (user_id)
      REFERENCES users(id),
    FOREIGN KEY(sender_country_id)
      REFERENCES countries(id),
    FOREIGN KEY (recive_country_id)
      REFERENCES countries(id)
);

CREATE TRIGGER posts
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE posts_id_seq OWNED BY posts.id;
ALTER sequence posts_id_seq INCREMENT BY 1; 

CREATE INDEX "index_posts_id" on posts(id);
CREATE INDEX "index_posts_name" on posts(name);
CREATE INDEX "index_posts_max_amount" on posts(max_amount);
CREATE INDEX "index_posts_min_amount" on posts(min_amount);
CREATE INDEX "index_posts_trance_price" on posts(trance_price);


CREATE TABLE transctions(
  id varchar PRIMARY KEY not null,
  post_id varchar not null,
  user_id varchar not null,
   FOREIGN KEY(post_id)
      REFERENCES posts(id),
   FOREIGN KEY(user_id)
      REFERENCES users(id)
);

CREATE TRIGGER transctions
BEFORE UPDATE ON transctions
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE transctions_id_seq OWNED BY transctions.id;
ALTER sequence transctions_id_seq INCREMENT BY 1; 

CREATE INDEX "index_transctions_id" on transctions(id);
CREATE INDEX "index_transctions_user_id" on transctions(user_id);

CREATE TABLE posts_history(
  id varchar PRIMARY KEY not null,
  name varchar not null,
  picture varchar DEFAULT '',
  max_amount varchar DEFAULT '',
  min_amount varchar DEFAULT '',
  description varchar DEFAULT '',
  trance_price varchar,
  category_id varchar not null,
  pay_type_id varchar not null,
  sender_country_id varchar not null,
  recive_country_id varchar not null,
  country_id varchar not null,
  user_id varchar not null,
  location varchar not null,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY(category_id)
      REFERENCES category_post(id),
    FOREIGN KEY(pay_type_id)
      REFERENCES payment_methods(id),
    FOREIGN KEY (user_id)
      REFERENCES users(id),
    FOREIGN KEY(sender_country_id)
      REFERENCES countries(id),
    FOREIGN KEY (recive_country_id)
      REFERENCES countries(id)
);

CREATE TRIGGER posts_history
BEFORE UPDATE ON posts_history
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE posts_history_id_seq OWNED BY posts_history.id;
ALTER sequence posts_history_id_seq INCREMENT BY 1; 

CREATE INDEX "index_posts_history_id" on posts_history(id);
CREATE INDEX "index_posts_history_name" on posts_history(name);
CREATE INDEX "index_posts_history_max_amount" on posts_history(max_amount);
CREATE INDEX "index_posts_history_min_amount" on posts_history(min_amount);
CREATE INDEX "index_posts_history_trance_price" on posts_history(trance_price);


CREATE TABLE transctions_history(
  id varchar PRIMARY KEY not null,
  post_id varchar not null,
  user_id varchar not null,
   FOREIGN KEY(post_id)
      REFERENCES posts(id),
   FOREIGN KEY(user_id)
      REFERENCES users(id)
);

CREATE TRIGGER transctions_history
BEFORE UPDATE ON transctions_history
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE SEQUENCE transctions_history_id_seq OWNED BY transctions_history.id;
ALTER sequence transctions_history_id_seq INCREMENT BY 1; 

CREATE INDEX "index_transctions_history_id" on transctions_history(id);


INSERT INTO countries (country_name, prefix_number, iso, utc, devise_code) VALUES
('Afghanistan', '+93', 'AF', '+4:30',''),
('Albania', '+355', 'AO', '+2', ''),
('Germany', '+49', 'DE', '+2', ''),
('Andorra', '+376', 'AD', '+1', ''),
('Angola', '+244', 'AO', '+1', ''),
('Anguilla', '+1 264', 'AI', '-4', ''),
('Antarctica', '+672', 'AQ', '+12', ''),
('Antigua and Barbuda', '+1 268', 'AG', '-4', ''),
('Saudi Arabia', '+966', 'SAU', '+3', ''),
('Algeria', '+213', 'DZA', '+1', ''),
('Argentina', '+54', 'ARG', '-3', '' ),
('Armenia', '+374', 'ARM', '+4', ''),
('Aruba', '+297', 'ABW', '-4', ''),
('Australia', '+61', 'AUS', '+10', ''),
('Austria', '+43', 'AUT', '+2', ''),
('Azerbaijan', '+994', 'AZE', '+4', ''),
('Belgium', '+32', 'BEL', '+2', ''),
('Bahamas', '+1 242', 'BHS', '-4', ''),
('Bahrain', '+973', 'BHR', '+3', ''),
('Bangladesh', '+880', 'BGD', '+6', ''),
('Barbados', '+1 246', 'BRB', '-4', ''),
('Belize', '+501', 'BLZ', '-6', ''),
('Benin', '+229', 'BEN', '+1', ''),
('Bhutan', '+975', 'BTN', '+6', ''),
('Belarus', '+375', 'BLR', '+3', ''),
('Myanmar', '+95', 'MMR', '+6:30', ''),
('Bolivia', '+591', 'BOL', '-4'),
('Bosnia and Herzegovina', '+387', 'BIH', '+2'),
('Botswana', '+267', 'BWA', '+2'),
('Brazil', '+55', 'BRA', '-3'),
('Brunei', '+673', 'BRN', '+8'),
('Bulgaria', '+359', 'BGR', '+3'),
('Burkina Faso', '+226', 'BFA', '+0'),
('Burundi', '+257', 'BDI', '+2'),
('Cape Verde', '+238', 'CPV', '-1'),
('Cambodia', '+855', 'KHW', '+7'),
('Cameroon', '+237', 'CMR', '+1'),
('Canada', '+1', 'CA', '-7'),
('Chad', '+235', 'TD', '+1'),
('Chile', '+56', 'CHL', '+1'),
('China', '+86', 'CHN', '+8'),
('Cyprus', '+357', 'CYP', '+2'),
('Vatican City State', '+39', 'VAT', '+1'),
('Colombia', '+57', 'CO', '-5'),
('Comoros', '+269', 'COM', '+3'),
('Republic of the Congo', '+242', 'CG', '+1'),
('Democratic Republic of the Congo', '+243', 'COD', '+2'),
('North Korea', '+850', '', ''),
('South Korea', '+82', 'KOR', '+9'),
('Ivory Coast', '+225', 'CIV', '0'),
('Costa Rica', '+506', 'CRI', '-6'),
('Croatia', '+385', 'HRV', '+1'),
('Cuba', '+53', 'CUB', '-5'),
('Curaçao', '+599', 'CUW', '-4'),
('Denmark', '+45', 'DNK', '+2'),
('Dominica', '+1 767', 'DMA', '-4'),
('Ecuador', '+593', 'ECU', '-5'),
('Egypt', '+20', 'EGY', '+2'),
('El Salvador', '+503', 'SLV', '-6'),
('United Arab Emirates', '+971', 'ARE', '+4'),
('Eritrea', '+291', 'ERI', '+3'),
('Slovakia', '+421', 'SVK', '+1'),
('Slovenia', '+386', 'SVN', '+2'),
('Spain', '+34', 'ESP', '+34'),
('United States of America', '+1', 'USA', '-6'),
('Estonia', '+372', 'EST', '+2'),
('Ethiopia', '+251', 'ETH', '+3'),
('Philippines', '+63', '', ''),
('Finland', '+358', 'FIN', '+3'),
('Fiji', '+679', 'FJI', '+12'),
('France', '+33', 'FRA', '+1'),
('Gabon', '+241', '', ''),
('Gambia', '+220', '', ''),
('Georgia', '+995', '', ''),
('Ghana', '+233', '', ''),
('Gibraltar', '+350', '', ''),
('Grenada', '+1 473', '', ''),
('Greece', '+30', '', ''),
('Greenland', '+299', '', ''),
('Guadeloupe', '+590', '', ''),
('Guam', '+1 671', '', ''),
('Guatemala', '+502', 'GTM', '-6'),
('French Guiana', '+594', '', ''),
('Guernsey', '+44', '', ''),
('Guinea', '+224', '', ''),
('Equatorial Guinea', '+240', 'GNQ', ''),
('Guinea-Bissau', '+245', '', ''),
('Guyana', '+592', '', ''),
('Haiti', '+509', '', ''),
('Honduras', '+504', 'HND', '-6'),
('Hong Kong', '+852', 'HK', ''),
('Hungary', '+36', '', ''),
('India', '+91', '', ''),
('Indonesia', '+62', '', ''),
('Iran', '+98', '', ''),
('Iraq', '+964', '', ''),
('Ireland', '+353', '', ''),
('Bouvet Island', '+nan', '', ''),
('Isle of Man', '+44', '', ''),
('Christmas Island', '+61', '', ''),
('Norfolk Island', '+672', '', ''),
('Iceland', '+354', '', ''),
('Bermuda Islands', '+1 441', '', ''),
('Cayman Islands', '+1 345', '', ''),
('Cocos (Keeling) Islands', '+61', '', ''),
('Cook Islands', '+682', '', ''),
('Åland Islands', '+358', '', ''),
('Faroe Islands', '+298', 'FRO', '+1'),
('South Georgia and the South Sandwich Islands', '+500', '', ''),
('Heard Island and McDonald Islands', '+nan', '', ''),
('Maldives', '+960', '', ''),
('Falkland Islands (Malvinas)', '+500', 'FLK', '-3'),
('Northern Mariana Islands', '+1 670', '', ''),
('Marshall Islands', '+692',  '', ''),
('Pitcairn Islands', '+870', '', ''),
('Solomon Islands', '+677', '', ''),
('Turks and Caicos Islands', '+1 649', '', ''),
('United States Minor Outlying Islands', '+246', '', ''),
('Virgin Islands', '+1 284', '', ''),
('United States Virgin Islands', '+1 340', '', ''),
('Israel', '+972', '', ''),
('Italy', '+39', '', ''),
('Jamaica', '+1 876', '', ''),
('Japan', '+81', '', ''),
('Jersey', '+44', '', ''),
('Jordan', '+962', '', ''),
('Kazakhstan', '+7', '', ''),
('Kenya', '+254', '', ''),
('Kyrgyzstan', '+996', '', ''),
('Kiribati', '+686', '', ''),
('Kuwait', '+965', '', ''),
('Lebanon', '+961', '', ''),
('Laos', '+856', '', ''),
('Lesotho', '+266', '', ''),
('Latvia', '+371', '', ''),
('Liberia', '+231', '', ''),
('Libya', '+218', '', ''),
('Liechtenstein', '+423', '', ''),
('Lithuania', '+370', '', ''),
('Luxembourg', '+352', '', ''),
('Mexico', '+52', 'MEX', '-6'),
('Monaco', '+377', '', ''),
('Macao', '+853', '', ''),
('Macedonia', '+389', '', ''),
('Madagascar', '+261', '', ''),
('Malaysia', '+60', '', ''),
('Malawi', '+265', '', ''),
('Mali', '+223', '', ''),
('Malta', '+356', '', ''),
('Morocco', '+212', '', ''),
('Martinique', '+596', '', ''),
('Mauritius', '+230', '', ''),
('Mauritania', '+222', '', ''),
('Mayotte', '+262', '', ''),
('Estados Federados de', '+691', '', ''),
('Moldova', '+373', '', ''),
('Mongolia', '+976', '', ''),
('Montenegro', '+382', '', ''),
('Montserrat', '+1 664', '', ''),
('Mozambique', '+258', '', ''),
('Namibia', '+264', '', ''),
('Nauru', '+674', '', ''),
('Nepal', '+977', '', ''),
('Nicaragua', '+505', '', ''),
('Niger', '+227', '', ''),
('Nigeria', '+234', '', ''),
('Niue', '+683', '', ''),
('Norway', '+47', '', ''),
('New Caledonia', '+687', '', ''),
('New Zealand', '+64', '', ''),
('Oman', '+968', '', ''),
('Netherlands', '+31', '', ''),
('Pakistan', '+92', '', ''),
('Palau', '+680', '', ''),
('Palestine', '+970', '', ''),
('Panama', '+507', 'PAN', '-5'),
('Papua New Guinea', '+675', '', ''),
('Paraguay', '+595', 'PRY', '-4'),
('Peru', '+51', 'PER', '-5'),
('French Polynesia', '+689', '', ''),
('Poland', '+48', '', ''),
('Portugal', '+351', '', ''),
('Puerto Rico', '+1', 'PRI', '+1'),
('Qatar', '+974', '', ''),
('United Kingdom', '+44', '', ''),
('Central African Republic', '+236', '', ''),
('Czech Republic', '+420', '', ''),
('Dominican Republic', '+1 809', '', ''),
('South Sudan', '+211', '', ''),
('Réunion', '+262', '', ''),
('Rwanda', '+250', '', ''),
('Romania', '+40', '', ''),
('Russia', '+7', '', ''),
('Western Sahara', '+212', '', ''),
('Samoa', '+685', '', ''),
('American Samoa', '+1 684', '', ''),
('Saint Barthélemy', '+590', '', ''),
('Saint Kitts and Nevis', '+1 869', '', ''),
('San Marino', '+378', '', ''),
('Saint Martin (French part)', '+1 599', '', ''),
('Saint Pierre and Miquelon', '+508', '', ''),
('Saint Vincent and the Grenadines', '+1 784', '', ''),
('Ascensión y Tristán de Acuña', '+290', '', ''),
('Saint Lucia', '+1 758', '', ''),
('Sao Tome and Principe', '+239', '', ''),
('Senegal', '+221', '', ''),
('Serbia', '+381', '', ''),
('Seychelles', '+248', '', ''),
('Sierra Leone', '+232', '', ''),
('Singapore', '+65', '', ''),
('Sint Maarten', '+1 721', '', ''),
('Syria', '+963', '', ''),
('Somalia', '+252', '', ''),
('Sri Lanka', '+94', '', ''),
('South Africa', '+27', '', ''),
('Sudan', '+249', '', ''),
('Sweden', '+46', '', ''),
('Switzerland', '+41', '', ''),
('Suriname', '+597', '', ''),
('Svalbard and Jan Mayen', '+47', '', ''),
('Swaziland', '+268', '', ''),
('Tajikistan', '+992', '', ''),
('Thailand', '+66', '', ''),
('Taiwan', '+886', '', ''),
('Tanzania', '+255', '', ''),
('British Indian Ocean Territory', '+246', '', ''),
('French Southern Territories', '+nan', '', ''),
('East Timor', '+670', '', ''),
('Togo', '+228', '', ''),
('Tokelau', '+690', '', ''),
('Tonga', '+676', '', ''),
('Trinidad and Tobago', '+1 868', '', ''),
('Tunisia', '+216', '', ''),
('Turkmenistan', '+993', '', ''),
('Turkey', '+90', '', ''),
('Tuvalu', '+688', '', ''),
('Ukraine', '+380', '', ''),
('Uganda', '+256', '', ''),
('Uruguay', '+598', 'URY', '-3'),
('Uzbekistan', '+998', '', ''),
('Vanuatu', '+678', '', ''),
('Venezuela', '+58', 'VEN', '-4'),
('Vietnam', '+84', '', ''),
('Wallis and Futuna', '+681', '', ''),
('Yemen', '+967', '', ''),
('Djibouti', '+253', '', ''),
('Zambia', '+260', '', ''),
('Zimbabwe', '+263', '', '');