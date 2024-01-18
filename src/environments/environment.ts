export const environment = {
  production: false,
  defaultLanguage: "en",
  baseUrl: "https://dev.renewbuy.com/",
  amsurl: "https://accounts.rbstaging.in/",
  wattsAppUrl: "https://api.whatsapp.com/send/?phone=91",
  fyntune_life: "https://uatterm.rbstaging.in/",
  categoryDomain: "https://dev.renewbuy.com/category-page/#/",
  claimServiceSupport: "https://www.renewbuy.com/renewbuy-partners/insurer-contacts/",
  dedicatedSupport: "https://partners.rbstaging.in/#/support-contact/",
  artivatic_flag: false,
  partner_v2: "https://partners.rbstaging.in/v2/",
  kyc: "https://partners.rbstaging.in/v2/kyc",
  training: "https://partners.rbstaging.in/v2/kyc",
  oldPlatform: "https://partners.rbstaging.in/#/",
  profileRedirect: "https://partners.rbstaging.in",
  motorBusiness: "/transaction-private-car",
  rbHealth: '/transaction-rb-health',
  healthBusiness: "/transaction-health",
  rbLife: "/transaction-rb-life",
  rbLoan: "/transaction-rbloans",
  rbCards: "/transaction-rb-cards",
  rbRoadProtectCards: "",
  finsure: "https://rbfinance.rbstaging.in/api/v2/token/validate_token/",
  finsureLoan: "https://rbfinance.rbstaging.in/api-loan/v1/credilio/rbloan-home",
  uatcar: "https://accounts.renewbuyinsurance.in",
  profile_redirection : "https://partners.rbstaging.in",
  lifeBusiness: "/transaction-life",
  dueRenewal: "/home/due-renewals/private-car",
  leadsMain: "/home/leads-main",
  proposals: "/home/leads/private-car",
  scheduleMeeting: "/home/schedule-meeting",
  marketing_manager: "https://partners.rbstaging.in/mm",
  renewButtonUrl: 'https://rbfinance.rbstaging.in/',
  isSkipFlag: true,
  isSkipbuttonWhatshapFlag: true,
  productModuleName: {
      "renewbuy-backend-header": {
          "api-secret-key": "YiBYbVTAOIT6TD2k8L3S22pou4IVBdR6",
          "app-id": "7b574be9-96c2-4afc-934e-a333f9d27e94"
      },
      "doc-renewbuy-backend-header": {
          "api-secret-key": "YiBYbVTAOIT6TD2k8L3S22pou4IVBdR6",
          "app-id": "7b574be9-96c2-4afc-934e-a333f9d27e94",
          "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryKEgMJVnTrbcHHNCT"
      },
      "ams-headers": {
          "api-key": "945dbc41-8587-4c62-82ca-741f914077cf",
          "secret-key": "dCr8hEr8WWaSlxoNrh6Dst9PLzWQJnqD"
      },
      "txn-headers": {
          "api-secret-key": "YiBYbVTAOIT6TD2k8L3S22pou4IVBdR6",
          "app-id": "7b574be9-96c2-4afc-934e-a333f9d27e94"
      }
      , "spear-headers": {
          "API-SECRET-KEY": "HTdtmtVjco0z3wIEhj1MsFPjOMRYKD0v",
          "App-Id": "5a52b07f-d8ad-4b12-ba80-def5fcf16d8c"
      },
      "new-headers": {
          "api-secret-key": "D3DqkwtWUJuQrHIah7KVcvWUukjvVZXn",
          "app-id": "30a24f26-b26d-4b13-868c-8ba482dce257"
      }
      , "finsure-headers": {
          "FINSURE-Api-Key": "g3qVtG0W.KOXfXafVmeyZuTbVqTNZcNBVOmPa6rGX",
          "app-id": "5a52b07f-d8ad-4b12-ba80-def5fcf16d8c"
      },
      "insurer-header": {
          "api-secret-key": "Sfhib3JpD7IEIPpwjFXNuLtkTXO9F3gX",
          "app-id": "13425c72-0c7e-4248-9ffc-3e06b0a12632"
      },
      "rms-headers":{
          "Api-key": "5a56ff0749ca4ba88cc762e8696d424d",
          "secret-key":"120082229742359458532408477966240924237"
      },
      "club-rb-headers": {
          "client-id": "c4df14c6d950817af5820cc38ca4d7cf",
          "client-secret":"MVB$OLQ&Wu?Fh6O%VK>[>T=qc}u@Vr9[k]2KKA/76Q-lwDr?jEq=y@ZzK?$!g^2v"
      }
  },
  "card-data": {
      "insurance": [
          {
              "icon": "assets/icons/tw_icon.svg",
              "name": "Two Wheeler",
              "class": "tw-card",
              "icon_mb": "assets/mobile/icons/tw_icon.svg",
              "redirection": "https://apiuatmotor.rbstaging.in/api/renewbuy/bike/GenerateLead",
              "func_val": "gi",
              "page_path": "transaction-two-wheeler",
              "product_type": "bike",
              "value": "",
              "lob_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "TwowheelerBtn",
                  "action": "click",
                  "value": "13"
              }
          },
          {
              "icon": "assets/icons/pw_icon.svg",
              "name": "Private Car",
              "class": "pw-card",
              "icon_mb": "assets/mobile/icons/pw_icon.svg",
              "redirection": "https://apiuatmotor.rbstaging.in/api/renewbuy/car/GenerateLead",
              "func_val": "gi",
              "page_path": "transaction-private-car",
              "product_type": "car",
              "value": "",
              "lob_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "CarBtn",
                  "action": "click",
                  "value": "14"
              }
          },
          {
              "icon": "assets/icons/cv_icon.svg",
              "name": "Commercial Vehicle",
              "class": "cv-card",
              "icon_mb": "assets/mobile/icons/cv_icon.svg",
              "redirection": "https://uatcar.rbstaging.in/cv/lead-page",
              "func_val": "gi",
              "page_path": "transaction-commercial-vehicle",
              "product_type": "cv",
              "value": "",
              "lob_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "CVBtn",
                  "action": "click",
                  "value": "15"
              }
          },
          {
              "icon": "assets/icons/health_inc_icon.svg",
              "name": "Health",
              "class": "health-inc",
              "icon_mb": "assets/mobile/icons/health_inc_icon.svg",
              "redirection": "https://dev.renewbuy.com/category-page/#/health-category",
              "func_val": "gi",
              "page_path": "transaction-health",
              "product_type": "health",
              "value": "d2dFlag",
              "lob_flag": false,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "HealthBtn",
                  "action": "click",
                  "value": "16"
              }
          },
          {
              "icon": "assets/icons/life_inc_icon.svg",
              "name": "Life",
              "class": "life-inc",
              "icon_mb": "assets/mobile/icons/life_inc_icon.svg",
              "redirection": "https://lifefe.diff.rbstaging.in/",
              "func_val": "li",
              "page_path": "transaction-life",
              "product_type": "life",
              "value": "d2dFlag",
              "lob_flag": false,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "LifeBtn",
                  "action": "click",
                  "value": "17"
              }
          }
      ],
      "txn-insurance": [
          {
              "icon": "assets/icons/tw_transaction.svg",
              "name": "Two Wheeler",
              "class": "tw-card",
              "icon_mb": "assets/icons/tw_transaction.svg",
              "redirection": "https://apiuatmotor.rbstaging.in/api/renewbuy/bike/GenerateLead",
              "func_val": "gi",
              "page_path": "transaction-two-wheeler",
          },
          {
              "icon": "assets/icons/pc_transaction.svg",
              "name": "Private Car",
              "class": "pw-card",
              "icon_mb": "assets/icons/pc_transaction.svg",
              "redirection": "https://apiuatmotor.rbstaging.in/api/renewbuy/car/GenerateLead",
              "func_val": "gi",
              "page_path": "transaction-private-car",
          },
          {
              "icon": "assets/icons/cv_transaction.svg",
              "name": "Commercial Vehicle",
              "class": "cv-card",
              "icon_mb": "assets/icons/cv_transaction.svg",
              "redirection": "https://uatcar.rbstaging.in/cv/lead-page",
              "func_val": "gi",
              "page_path": "transaction-commercial-vehicle",
          },
          {
              "icon": "assets/icons/health_transaction.svg",
              "name": "Health",
              "class": "health-inc",
              "icon_mb": "assets/icons/health_transaction.svg",
              "redirection": "https://dev.renewbuy.com/category-page/#/health-category",
              "func_val": "gi",
              "page_path": "transaction-health",
          },
          {
              "icon": "assets/icons/life_transaction.svg",
              "name": "Life",
              "class": "life-inc",
              "icon_mb": "assets/icons/life_transaction.svg",
              "redirection": "https://lifefe.diff.rbstaging.in/",
              "func_val": "li",
              "page_path": "transaction-life",
          },
          {
              "icon": "assets/icons/inspection_transaction.svg",
              "name": "Inspection Status",
              "class": "is-card",
              "icon_mb": "assets/icons/inspection_transaction.svg",
              "redirection": "https://partners.rbstaging.in/#/motor/inspection-list/",
          },
          {
              "icon": "assets/icons/c_kyc_transaction.svg",
              "name": "C-KYC",
              "class": "kycCard",
              "icon_mb": "assets/icons/c_kyc_transaction.svg",
              "page_path": "transaction-c-kyc",
              "redirection": "https://dev.renewbuy.com/category-page/#/ckyc-status/",
          }
      ],
      "txn-finsure": [
          {
              "icon": "assets/icons/rb_health_transaction.svg",
              "name": "RB Health",
              "class": "rh-card coming_soon_class",
              "icon_mb": "assets/icons/rb_health_transaction.svg",
              "redirection": "https://rbfinance.rbstaging.in/#/quotes",
              "func_val": "kyc_pending",
              "page_path": "transaction-rb-health"
          },
          {
              "icon": "assets/icons/rb_life_transaction.svg",
              "name": "RB Life",
              "class": "life-inc",
              "icon_mb": "assets/icons/rb_life_transaction.svg",
              "page_path": "transaction-rb-life"
          },



          // {
          //     "icon": "assets/images/rb_card.svg",
          //     "name": "RB Cards",
          //     "class": "rb-card",
          //     "page_path" : "transaction-rb-cards"
          // },
          {
              "icon": "assets/icons/rb_cards_transaction.svg",
              "name": "RB Cards",
              "icon_mb": "assets/icons/rb_cards_transaction.svg",
              "class": "rb-card",
              "page_path": "transaction-rb-cards"
          },
          {
              "icon": "assets/icons/rb_loans_transaction.svg",
              "name": "RB Loans",
              "class": "rbloans",
              "icon_mb": "assets/icons/rb_loans_transaction.svg",
              "page_path": "transaction-rbloans"
          }
          // {
          //     "icon": "assets/images/road-protect.svg",
          //     "name": "RB Road Protect",
          //     "class": "rb-road-protect",
          //     "page_path" : "transaction-rb-road-protect"
          // }
      ],
      "finsure": [
          {
              "icon": "assets/icons/rb_health.svg",
              "name": "RB Health",
              "class": "rh-card coming_soon_class",
              "icon_mb": "assets/mobile/icons/rb_health.svg",
              "redirection": "https://rbfinance.rbstaging.in/#/quotes",
              "func_val": "kyc_pending",
              "product_type": "Health",
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "RBhealthBtn",
                  "action": "click",
                  "value": "18"
              }
          },
          {
              "icon": "assets/icons/web_life.svg",
              "name": "RBLife Term",
              "class": "rb-life-card coming_soon_class",
              "icon_mb": "assets/mobile/icons/mobile_life.svg",
              "redirection": "https://rbfinance.rbstaging.in/#/quotes",
              "func_val": "kyc_pending",
              "product_type": "Life",
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "RBhealthBtn",
                  "action": "click",
                  "value": "18"
              }
          },
          {
              "icon": "assets/icons/web_cards.svg",
              "name": "RB Cards",
              "class": "rh-cards coming_soon_class",
              "icon_mb": "assets/mobile/icons/mobile_cards.svg",
              "redirection": "https://rbfinance.rbstaging.in/#/quotes",
              "func_val": "kyc_pending",
              "product_type": "Cards",
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "RBhealthBtn",
                  "action": "click",
                  "value": "18"
              }
          },
          // {
          //     "icon": "assets/icons/rb_motor.svg",
          //     "name": "RB Road Protect",
          //     "class": "r_road_protect coming_soon_class",
          //     "icon_mb":"assets/mobile/icons/rb_motor.svg",
          //     "redirection":"https://rbfinance.rbstaging.in/#/quotes",
          //     "func_val": "kyc_pending",
          //     "product_type": "Motor",
          //     "anaytic": {
          //         "name": "home",
          //         "page": "newPartnerPortal",
          //         "category": "home",
          //         "label": "RBhealthBtn",
          //         "action": "click",
          //         "value": "18"
          //     }
          // },

          {
              "icon": "assets/icons/Rb_loan.svg",
              "name": "RB Loans",
              "class": "rb_loans coming_soon_class",
              "icon_mb": "assets/mobile/icons/Rb_mb_loan.svg",
              "redirection": "https://rbfinance.rbstaging.in/#/home",
              "func_val": "kyc_pending",
              "product_type": "",
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "RBhealthBtn",
                  "action": "click",
                  "value": "18"
              }
          },
          {
              "icon": "assets/icons/rb_silver.svg",
              "name": "RB Health Silver",
              "class": "silver-card hide-card coming_soon_class",
              "icon_mb": "assets/mobile/icons/rb_silver.svg",
              "redirection": "https://rbfinance.rbstaging.in/#/quotes",
              "func_val": "kyc_pending",
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "",
                  "action": "click",
                  "value": "17"
              }
          },
          {
              "icon": "assets/icons/rb_gold.svg",
              "name": "RB Health Gold",
              "class": "rb-gold-card hide-card coming_soon_class",
              "icon_mb": "assets/mobile/icons/rb_gold.svg",
              "redirection": "https://rbfinance.rbstaging.in/#/quotes",
              "func_val": "kyc_pending",
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "",
                  "action": "click",
                  "value": "17"
              }
          },
          {
              "icon": "assets/icons/cc_icon.svg",
              "name": "Credit Card",
              "class": "cc-card hide-card coming_soon_class",
              "icon_mb": "assets/mobile/icons/cc_icon.svg",
              "redirection": "javascript:void(0)",
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "CreditcardBtn",
                  "action": "click",
                  "value": "20"
              }
          },
          {
              "icon": "assets/icons/loan_icon.svg",
              "name": "Loan",
              "class": "loan-card hide-card coming_soon_class",
              "icon_mb": "assets/mobile/icons/loan_icon.svg",
              "redirection": "javascript:void(0)"
          },
          {
              "icon": "assets/icons/mf_icon.svg",
              "name": "Mutual Fund",
              "class": "mutual-card hide-card coming_soon_class",
              "icon_mb": "assets/mobile/icons/mf_icon.svg",
              "redirection": "javascript:void(0)"
          },
          {
              "icon": "assets/icons/apollo_icon.svg",
              "name": "Apollo 24/7",
              "class": "apollo-card hide-card coming_soon_class",
              "icon_mb": "assets/mobile/icons/apollo_icon.svg",
              "redirection": "javascript:void(0)"
          },
          // {
          //     "icon": "assets/icons/deposit_icon.svg",
          //     "name": "Deposit",
          //     "class": "deposit-card hide-card",
          //     "icon_mb":"assets/mobile/icons/deposit_icon.svg",
          //     "redirection":"javascript:void(0)"
          // },
          // {
          //     "icon": "assets/icons/gold_icon.svg",
          //     "name": "Gold ETF",
          //     "class": "gold-card hide-card",
          //     "icon_mb":"assets/mobile/icons/gold_icon.svg",
          //     "redirection":"javascript:void(0)"
          // }
      ],

      "utility": [
          {
              "icon": "assets/icons/i_meeting.svg",
              "name": "iMeetings",
              "icon_mb": "assets/mobile/icons/i_meeting.svg",
              "redirection": "https://rbav.rbstaging.in/meeting-list",
              "redirection_flag": false,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "ImeetingsBtn",
                  "action": "click",
                  "value": "23"
              }
          },
          {
              "icon": "assets/icons/transaction_icon.svg",
              "name": "Transactions",
              "icon_mb": "assets/mobile/icons/transaction_icon.svg",
              "redirection": "/transaction",
              "redirection_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "TransactionBtn",
                  "action": "click",
                  "value": "24"
              }
          },
          {
              "icon": "assets/icons/passbook_icon.svg",
              "name": "Passbook",
              "icon_mb": "assets/mobile/icons/passbook_icon.svg",
              "redirection": "/passbook",
              "redirection_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "PassbookBtn",
                  "action": "click",
                  "value": "25"
              }
          },
          // {
          //     "icon": "assets/icons/leads_icon.svg",
          //     "name": "Leads",
          //     "icon_mb":"assets/mobile/icons/leads_icon.svg",
          //     "redirection":"https://partners.rbstaging.in/#/motor/saved-quotes",
          //     "redirection_flag":false,
          //     "anaytic": {
          //         "name": "home",
          //         "page": "newPartnerPortal",
          //         "category": "home",
          //         "label": "LeadsBtn",
          //         "action": "click",
          //         "value": "26"
          //     }
          // },
          {
              "icon": "assets/icons/helpdesk_icon.svg",
              "name": "Helpdesk",
              "icon_mb": "assets/mobile/icons/helpdesk_icon.svg",
              "redirection": "/helpdesk",
              "redirection_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "HelpdeskBtn",
                  "action": "click",
                  "value": "27"
              }
          },
          // {
          //     "icon": "assets/icons/ria_icon.svg",
          //     "name": "RIA",
          //     "icon_mb":"assets/mobile/icons/ria_icon.svg",
          //     "redirection":"javascript:void(0)",
          //     "redirection_flag":false,
          //     "class":"coming_soon_feature",
          //     "anaytic": {
          //         "name": "home",
          //         "page": "newPartnerPortal",
          //         "category": "home",
          //         "label": "RIABtn",
          //         "action": "click",
          //         "value": "28"
          //     }
          // },
          // {
          //     "icon": "assets/icons/mm_icon.svg",
          //     "name": "Marketing Manager",
          //     "icon_mb":"assets/mobile/icons/mm_icon.svg",
          //     "redirection":"https://partners.rbstaging.in/mm",
          //     "redirection_flag":false,
          //     "anaytic": {
          //         "name": "home",
          //         "page": "newPartnerPortal",
          //         "category": "home",
          //         "label": "MarketingBtn",
          //         "action": "click",
          //         "value": "29"
          //     }
          // },
          {
              "icon": "assets/icons/claims_icon.svg",
              "name": "Claims",
              "icon_mb": "assets/mobile/icons/claims_icon.svg",
              "redirection": "/helpdesk/claims",
              "redirection_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "ClaimsBtn",
                  "action": "click",
                  "value": "30"
              }
          },
          {
              "icon": "assets/icons/ac_icon.svg",
              "name": "Advisor Connect",
              "icon_mb": "assets/mobile/icons/ac_icon.svg",
              "redirection": "https://partners.renewbuy.com/beta/#/advisor-connect",
              "redirection_flag": false,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "AdvisorBtn",
                  "action": "click",
                  "value": "31"
              }
          },
          {
              "icon": "assets/icons/ncp_icon.svg",
              "name": "NCB/PYP Recovery",
              "icon_mb": "assets/mobile/icons/ncp_icon.svg",
              "redirection": "/ncp-pyp",
              "redirection_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "NCBBtn",
                  "action": "click",
                  "value": "33"
              }
          },
          // {
          //     "icon": "assets/icons/cash_online.svg",
          //     "name": "Cash Online",
          //     "icon_mb":"assets/mobile/icons/cash_online.svg",
          //     "redirection":"https://partners.rbstaging.in/#/cashonline/enroll",
          //     "redirection_flag":false,
          //     "anaytic": {
          //         "name": "home",
          //         "page": "newPartnerPortal",
          //         "category": "home",
          //         "label": "CashonlineBtn",
          //         "action": "click",
          //         "value": "34"
          //     }
          // },
          // {
          //     "icon": "assets/icons/renewal_icon.svg",
          //     "name": "Missed Renewals",
          //     "icon_mb":"assets/mobile/icons/renewal_icon.svg",
          //     "redirection":"https://partners.rbstaging.in/#/executive/reports/previously-lost/",
          //     "redirection_flag":false,
          //     "anaytic": {
          //         "name": "home",
          //         "page": "newPartnerPortal",
          //         "category": "home",
          //         "label": "RenewalsBtn",
          //         "action": "click",
          //         "value": "35"
          //     }
          // },
          {
              "icon": "assets/icons/upload_doc_icon.svg",
              "name": "Upload Document",
              "icon_mb": "assets/mobile/icons/upload_doc_icon.svg",
              "redirection": "/documents-upload",
              "redirection_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "",
                  "action": "click",
                  "value": ""
              }
          },
          {
              "icon": "assets/icons/policy_doc_icon.svg",
              "name": "Offline Policy",
              "icon_mb": "assets/mobile/icons/policy_doc_icon.svg",
              "redirection": "/offline-policy",
              "redirection_flag": true,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "",
                  "action": "click",
                  "value": ""
              }
          },
          // {
          //     "icon": "assets/icons/breakin_icon.svg",
          //     "name": "Break-in Inspection",
          //     "icon_mb":"assets/mobile/icons/breakin_icon.svg",
          //     "redirection":"https://uatdashboard.rbstaging.in/car_inspection_status",
          //     "redirection_flag":false,
          //     "anaytic": {
          //         "name": "home",
          //         "page": "newPartnerPortal",
          //         "category": "home",
          //         "label": "Break-InBtn",
          //         "action": "click",
          //         "value": "32"
          //     }
          // }

          {
              "icon": "assets/icons/Webinar_icon.svg",
              "name": "Webinars",
              "icon_mb": "assets/mobile/icons/Webinar_mb.svg",
              "redirection": "https://partners.rbstaging.in/mm/webinarpage",
              "redirection_flag": false,
              "anaytic": {
                  "name": "home",
                  "page": "newPartnerPortal",
                  "category": "home",
                  "label": "WebinarBtn",
                  "action": "click",
                  "value": "27"
              }
          }
      ]
  }


};