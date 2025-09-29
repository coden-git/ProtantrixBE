
const acitivity = [
        {
            name: 'Documentation',
            poValue: "",
            checkLists: [
                { name: "Soil test report", type: checkList.checkBox },
                { name: "Site survey", type: checkList.checkBox },
                { name: "Structural drawings", type: checkList.checkBox },
                { name: "Statutory permissions", type: checkList.checkBox },
                { name: "Plan and elevation", type: checkList.checkBox },
                { name: "EHS work permits", type: checkList.checkBox },
                { name: "Plumbing and electrical drawing", type: checkList.checkBox },
                { name: "BOQ - Bill of quantities", type: checkList.checkBox },
                { name: "Project schedule", type: checkList.checkBox }
            // TODO add more checklist items if needed

            ],
            measurement: measurements.LOT
        },
        {
            name: 'Site marking',
            poValue: "",
            checkLists: [
                { name: "Drawing Dimension check", type: checkList.checkBox },
            ],
            measurement: measurements.LOT
        },
        {
            name: 'Level marking',
            poValue: "",
            checkLists: [
                { name: "Drawing Dimension check", type: checkList.checkBox },
            ],
            measurement: measurements.LOT
        },
        {
            name: 'Excavation',
            poValue: "",
            checkLists: [
                { name: "Level check", type: checkList.checkBox },
            ],
            measurement: measurements.CUM        },
        {
            name: 'Footing PCC (PCC)',
            poValue: "",
            checkLists: [
                { name: "Level check", type: checkList.checkBox },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios },
                { name: "Curing (3 days)", type: checkList.checkBox, isRequired:false }
            ],
            measurement: measurements.CUM
        },
        {
            name: 'Footing reinforcement',
            poValue: "",
            checkLists: [
                { name: "Dimension check", type: checkList.checkBox },
                { name: "Rust check", type: checkList.checkBox },
                { name: "Cover Block check", type: checkList.checkBox }
            ],
            measurement: measurements.KgsDia
        },
        {
            name: 'Column reinforcement',
            poValue: "",
            checkLists:  [
                { name: "Plumb", type: checkList.checkBox },
                { name: "Alignment", type: checkList.checkBox }
              ],
            measurement: measurements.KgsDia
        },
        {
            name: 'Shuttering',
            poValue: "Form Work",
            checkLists:  [
                { name: "Plumb and alignment", type: checkList.checkBox },
                { name: "Concrete cover", type: checkList.checkBox }
              ],
            measurement: measurements.KgsDia
        },
        {
            name: 'Footing concrete (RCC)',
            poValue: "",
            checkLists:  [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing", type: checkList.checkBox, isRequired:false },
                { name: "Cube cast", type: checkList.checkBox }, // TODO
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios }
              ],
            // measurement: measurements.KgsDia Need to work TODO:
        },
        {
            name: 'Column marking',
            poValue: "",
            checkLists:  [
                { name: "Dimension check", type: checkList.checkBox },
              ],
            measurement: measurements.LOT  
        },
        {
            name: 'Column shuttering',
            poValue: "",
            checkLists:  [
                { name: "Cover and plumb check", type: checkList.checkBox },
              ],
            measurement: measurements.SqM  
        },
        {
            name: 'Column concrete',
            poValue: "",
            checkLists:  [
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios },
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Cube cast", type: checkList.checkBox }, // TODO
                { name: "Curing", type: checkList.checkBox, isRequired: false }
              ],
            measurement: measurements.CUM  
        },
        {
            name: 'Foundation Backfilling',
            poValue: "",
            checkLists:  [
                { name: "600 mm per fill with compactor", type: checkList.checkBox },
                { name: "Curing", type: checkList.checkBox, isRequired: false }
              ],
            measurement: measurements.CUM  
        },
        {
            name: 'Foundation Backfilling',
            poValue: "",
            checkLists:  [
                { name: "Mud mix", type: checkList.checkBox },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios },
                { name: "Curing", type: checkList.checkBox, isRequired:false }
              ],
            measurement: measurements.CUM  
        },
        {
            name: 'Stone Masonry',
            poValue: "Stone Masonry",
            checkLists:  [
                { name: "Alignment", type: checkList.checkBox },
                { name: "Dimension check", type: checkList.checkBox },
                { name: "Level check", type: checkList.checkBox },
                { name: "Curing", type: checkList.checkBox, isRequired: false},
                { name: "Mortar Ratio", type: checkList.dropdown, options:masters.mortarsRatio }
              ],
            measurement: measurements.CUM  
        },
        {
            name: 'Sizestone top PCC',
            poValue: "PCC",
            checkLists:  [
                { name: "Level Check", type: checkList.checkBox },
                { name: "Mixing ratio", type: checkList.dropdown },
                { name: "Curing", type: checkList.checkBox, isRequired: false }
              ],
            measurement: measurements.CUM  
        },
        {
            name: 'Plinth reinforcement',
            poValue: "Reinforcement",
            checkLists:  [
                { name: "Dimension check", type: checkList.checkBox },
                { name: "Rust check", type: checkList.checkBox },
                { name: "Alignment", type: checkList.checkBox }
              ],
            measurement: measurements.KgsDia  
        },
        {
            name: 'Plinth shuttering',
            poValue: "Form Work",
            checkLists:  [
                { name: "Plumb and alignment", type: checkList.checkBox },
                { name: "Concrete cover", type: checkList.checkBox }
              ],
            measurement: measurements.SqM  
        },
        {
            name: 'Plinth concrete',
            poValue: "RCC",
            checkLists: [
                { name: "Mixing ratio", type: checkList.checkBox },
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Cube test", type: checkList.checkBox }, // TODO
                { name: "Curing", type: checkList.checkBox, isRequired: false }
              ],
            measurement: measurements.CUM  
        },
        {
            name: 'Floor Backfilling',
            poValue: "Backfilling",
            checkLists: [
                { name: "Compaction for 6 days", type: checkList.checkBox },
                ],
            measurement: measurements.CUM  
        },
        {
            name: 'Drain plumbing',
            poValue: "PVC plumbing",
            checkLists: [
                { name: "Position check", type: checkList.checkBox },
                { name: "Slope test", type: checkList.checkBox },
                { name: "End Caps", type: checkList.checkBox },
                { name: "Leak test", type: checkList.table, value: leakTestTable  }
              ]
              ,
            measurement: measurements.RM_PLUM // TODO
        },
        {
            name: 'Plumbing backfilling with Msand',
            poValue: "Backfilling",
            checkLists: [
                { name: "Compaction", type: checkList.checkBox },
              ]
              ,
            measurement: measurements.CUM  
        },
        {
            name: 'Anti termite coating',
            poValue: "Anti termite coating",
            checkLists: [
                { name: "Quantity", type: checkList.checkBox },
                { name: "Rain Proof", type: checkList.checkBox },
              ]
              ,
            measurement: measurements.SqM  
        },
        {
            name: 'Wetmix',
            poValue: "Soling/Wetmix",
            checkLists: [
                { name: "Level check", type: checkList.checkBox },
                { name: "compaction", type: checkList.checkBox },
              ]
              ,
            measurement: measurements.CUM  
        },
        {
            name: 'Block Masonry',
            poValue: "Block Masonry",
            checkLists: [
                { name: "Block wetting", type: checkList.checkBox },
                { name: "plumb and right angle", type: checkList.checkBox },
                { name: "Mortar Ratio", type: checkList.dropdown, options:masters.mortarsRatio }
              ]
              ,
            measurement: measurements.SqM  
        },
        {
            name: 'Brick Masonry',
            poValue: "Brick Masonry",
            checkLists: [
                { name: "Block wetting", type: checkList.checkBox },
                { name: "plumb and right angle", type: checkList.checkBox },
                { name: "Mortar Ratio", type: checkList.dropdown, options:masters.mortarsRatio }
              ]
              ,
            measurement: measurements.SqM  
        },
        {
            name: 'Laterite Masonry',
            poValue: "Laterite Masonry",
            checkLists: [
                { name: "Block wetting", type: checkList.checkBox },
                { name: "plumb and right angle", type: checkList.checkBox },
                { name: "Mortar Ratio", type: checkList.dropdown, options:masters.mortarsRatio }
              ]
              ,
            measurement: measurements.SqM  
        },
        {
            name: 'RCC',
            poValue: "Lintel Concrete",
            checkLists: [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing 7days", type: checkList.checkBox, isRequired:false },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios }
              ]
              ,
            measurement: measurements.CUM  
        },
        {
            name: 'RCC',
            poValue: "Chajja Concrete",
            checkLists: [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing 7days", type: checkList.checkBox, isRequired:false },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios }
              ]
              ,
            measurement: measurements.CUM  
        },
        {
            name: 'Slab shuttering	',
            poValue: "Form Work",
            checkLists: [
                { name: "Gaps and levels", type: checkList.checkBox },
                { name: "Beam verticals", type: checkList.checkBox },
                { name: "Level check", type: checkList.checkBox, },
              ]
              ,
            measurement: measurements.SqM  
        },
        {
            name: 'Slab reinforcement',
            poValue: "reinforcement",
            checkLists: [
                { name: "Cover blocks", type: checkList.checkBox },
                { name: "Chair laying", type: checkList.checkBox },
                { name: "Dimension check", type: checkList.checkBox, },
              ]
              ,
            measurement: measurements.KgsDia  
        },
        {
            name: 'Slab conduiting',
            poValue: "conduiting",
            checkLists: [
                { name: "Conduit quality check", type: checkList.checkBox },
                { name: "Seemless routing", type: checkList.checkBox },
                { name: "Cover blocks", type: checkList.checkBox, },
                { name: "Thermocol placement", type: checkList.checkBox, },
                { name: "Conduit damage check", type: checkList.checkBox, },
                { name: "Dimension check", type: checkList.checkBox, },
              ]
              ,
            measurement: measurements.RM_CONDUIT  
        },
        {
            poValue: 'RCC',
            name: "Slab Concrete",
            checkLists: [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing 15days", type: checkList.checkBox, isRequired:false },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios },
                { name: "Cube test", type: checkList.checkBox }, // TODO
              ]
              ,
            measurement: measurements.CUM  
        },
        {
            poValue: 'RCC',
            name: "Deck sheet concrete",
            checkLists: [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing 15days", type: checkList.checkBox, isRequired:false },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios },
                { name: "Cube test", type: checkList.checkBox }, // TODO
                { name: "L-Flashing and expansion joints", type: checkList.checkBox }, 
              ]
              ,
            measurement: measurements.CUM  
        },
        {
            poValue: 'RCC',
            name: "Column Extension",
            checkLists: [
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios },
                { name: "Lapping check", type: checkList.checkBox }, 
              ]
              ,
            measurement: measurements.LOT  
        },
        {
            poValue: '',
            name: "Slab deshuttering",
            checkLists: [
                { name: "Honey comb check", type: checkList.checkBox }, 
              ]
              ,
            measurement: measurements.LOT  
        },
        {
            poValue: 'Roof waterproofing',
            name: "Roof waterproofing",
            checkLists: [
                { name: "Leak test Resutls", type: checkList.dateRange }, 
              ]
              ,
            measurement: measurements.SqM  
        },
        {
            poValue: 'conduiting',
            name: "Electrical wall conduiting",
            checkLists: [
                { name: "Chasing depth", type: checkList.checkBox },
                { name: "Positioning and dimensions", type: checkList.checkBox },
                { name: "Positioning and dimensions", type: checkList.checkBox }, 
              ]
              ,
            measurement: measurements.RM_CONDUIT  
        },
        {
            poValue: 'switch box',
            name: "Electrical switch box",
            checkLists: [
                { name: "Spirit level", type: checkList.checkBox },
                { name: "Screw fixing", type: checkList.checkBox },
                { name: "Surface level", type: checkList.checkBox }, 
              ]
              ,
            measurement: measurements.SWITCH_COUNT  
        },
        {
            poValue: 'Wood works',
            name: "Frame Fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox },
                { name: "plumb", type: checkList.checkBox },
              ]
              ,
            // measurement:  TODO
        },
        {
            poValue: 'AC works',
            name: "AC Conceals",
            checkLists: [
                { name: "Leak Test", type: checkList.table, value: leakTestTableAC },
                { name: "slope check", type: checkList.checkBox },
              ]
              ,
            measurement:  measurements.AC_CONDUIT
        },
        {
            poValue: 'Plastering',
            name: "Plastering",
            checkLists: [
                { name: "Surface finish", type: checkList.checkBox },
                { name: "mortar ratio", type: checkList.checkBox },
                { name: "mesh on joints", type: checkList.checkBox },
                { name: "right angle", type: checkList.checkBox },
                { name: "plumb", type: checkList.checkBox },
                { name: "curing for 7 days", type: checkList.checkBox, isRequired:false },

              ]
              ,
            measurement:  measurements.SqM
        },
        {
            poValue: 'Structural Steel',
            name: "Structural Fabrication",
            checkLists: [
                { name: "Rust check", type: checkList.checkBox },
                { name: "bend check", type: checkList.checkBox },
                { name: "weighment", type: checkList.checkBox },
                { name: "alignment", type: checkList.checkBox },
                { name: "Welding finish", type: checkList.checkBox },
                { name: "buffing", type: checkList.checkBox },

              ],
            // measurement:  TODO
        },
        {
            poValue: 'Steel primer application',
            name: "Steel primer application",
            checkLists: [
                { name: "surface finish", type: checkList.checkBox }

              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Elevation works',
            name: "Elevation works",
            checkLists: [
                { name: "Dimension check", type: checkList.checkBox },
                { name: "Curing 7 days", type: checkList.checkBox, isRequired:false },

              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'CPVC plumbing',
            name: "CPVC plumbing",
            checkLists: [
                { name: "Leak test", type: checkList.table, value: leakTestTable },
                { name: "Level check", type: checkList.checkBox },

              ],
            measurement:  measurements.RM_PLUM
        },
        {
            poValue: 'Water proofing ',
            name: "Water proofing and chemical coating upto 1 m",
            checkLists: [
                { name: "Leak test Resutls 7days", type: checkList.dateRange },
                { name: "Leak Test for coating", type: checkList.checkBox },
                { name: "Join filling", type: checkList.checkBox },

              ],
            measurement:  measurements.SqM
        },
        {
            poValue: 'Water proofing  Concrete',
            name: "Restroom waterproofing screed",
            checkLists: [
                { name: "Leak test Resutls 7days", type: checkList.dateRange },
                { name: "Leak Test for coating", type: checkList.checkBox },
                { name: "Bore Packing", type: checkList.checkBox },

              ],
            measurement:  measurements.SqM
        },
        {
            poValue: 'PVC plumbing',
            name: "Washroom Drain plumbing",
            checkLists: [
                { name: "Slope test", type: checkList.dateRange },
                { name: "Traps", type: checkList.checkBox },
                { name: "Leak test", type: checkList.table, value: leakTestTable },

              ],
            measurement:  measurements.RM_PLUM
        },
        {
            poValue: 'Sinder',
            name: "Restroom Sinder filling",
            checkLists: [
                { name: "Waterproof damage", type: checkList.checkBox },
              ],
            measurement:  measurements.CUM
        },
        {
            poValue: 'Sinder',
            name: "Restroom Sinder filling",
            checkLists: [
                { name: "Waterproof damage", type: checkList.checkBox },
              ],
            measurement:  measurements.CUM
        },
        {
            poValue: 'PCC',
            name: "Restroom concrete ",
            checkLists: [
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios  },
              ],
            measurement:  measurements.CUM
        },
        {
            poValue: 'Water proofing ',
            name: "Restroom floor chemical coating",
            checkLists: [
                { name: "Coving check", type: checkList.checkBox},
              ],
            measurement:  measurements.SqM
        },
        {
            poValue: '',
            name: "Putty and sanding",
            checkLists: [
                { name: "Surface finish", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'cabling',
            name: "electrical cabling",
            checkLists: [
                { name: "No cable joints", type: checkList.checkBox},
                { name: "Guage check", type: checkList.checkBox},
                { name: "Core check", type: checkList.checkBox},
              ],
            // measurement:  measurements. TODO
        },
        {
            poValue: 'cabling',
            name: "CCTV/network cabling",
            checkLists: [
                { name: "No cable joints", type: checkList.checkBox},
                { name: "Guage check", type: checkList.checkBox},
                { name: "Core check", type: checkList.checkBox},
              ],
            // measurement:  measurements. TODO
        },
        {
            poValue: '',
            name: "False ceiling grid laying",
            checkLists: [
                { name: "Level check", type: checkList.checkBox},
                { name: "Supporting", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'False ceiling',
            name: "False ceiling",
            checkLists: [
                { name: "Joint tape", type: checkList.checkBox},
                { name: "Undulations", type: checkList.checkBox},
                { name: "Misc supports", type: checkList.checkBox},
                { name: "Electrical points dimensional check", type: checkList.checkBox},

              ],
            measurement:  measurements.SqM
        },
        {
            poValue: '',
            name: "Ceiling putty and sanding",
            checkLists: [
                { name: "Surface Finish", type: checkList.checkBox},
              ],
            measurement:  measurements.SqM
        },
        {
            poValue: 'Cement carving works',
            name: "Cement carving works",
            checkLists: [
                { name: "Straightness", type: checkList.checkBox},
                { name: "Damage", type: checkList.checkBox},

              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Wood works',
            name: "Wooden window frame fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "plumb", type: checkList.checkBox},
                { name: "corner gaps", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Windows',
            name: "Aluminium/UPVC window frame fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "plumb", type: checkList.checkBox},
                { name: "corner gaps", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
                { name: "Drain track check", type: checkList.checkBox},

              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Granite Laying',
            name: "Granite Laying",
            checkLists: [
                { name: "Levels and alignment", type: checkList.checkBox},
                { name: "Edge chip off", type: checkList.checkBox},
                { name: "Slope", type: checkList.checkBox},
                { name: "spacer alignment", type: checkList.checkBox},
                { name: "Curing 3 days", type: checkList.checkBox, isRequired: false},

              ],
            measurement:  {...measurements.LOT, UOM:'SFt'}
        },
        {
            poValue: 'Marble Laying',
            name: "Marble Laying",
            checkLists: [
                { name: "Levels and alignment", type: checkList.checkBox},
                { name: "Edge chip off", type: checkList.checkBox},
                { name: "Slope", type: checkList.checkBox},
                { name: "spacer alignment", type: checkList.checkBox},
                { name: "Curing 3 days", type: checkList.checkBox, isRequired: false},

              ],
            measurement:  {...measurements.LOT, UOM:'SFt'}
        },
        {
            poValue: 'tiles laying',
            name: "Flooring and wall tiles laying",
            checkLists: [
                { name: "Levels and alignment", type: checkList.checkBox},
                { name: "Edge chip off", type: checkList.checkBox},
                { name: "Slope", type: checkList.checkBox},
                { name: "spacer alignment", type: checkList.checkBox},
                { name: "Curing 3 days", type: checkList.checkBox, isRequired: false},

              ],
            measurement:  {...measurements.LOT, UOM:'SFt'}
        },
        {
            poValue: 'Acid Wash',
            name: "Floor cleaning and grouting",
            checkLists: [
                { name: "Grout depth", type: checkList.checkBox},
                { name: "Tile damage", type: checkList.checkBox},
              ],
            measurement:  {...measurements.LOT, UOM:'SFt'}
        },
        {
            poValue: 'Tile protection',
            name: "Tile protection",
            checkLists: [
                { name: "Gaps", type: checkList.checkBox},
                { name: "Gumming", type: checkList.checkBox},
              ],
            measurement:  {...measurements.LOT, UOM:'SFt'}
        },
        {
            poValue: 'Wood works',
            name: "Wooden window  fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},

              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Windows',
            name: "Alluminium/UPVC window fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Wood works',
            name: "Wooden door  fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Doors',
            name: "Alluminium/WPC door fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Doors',
            name: "Alluminium/WPC door fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Glass Glazing',
            name: "Glass Glazing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
              ],
            measurement:  {...measurements.LOT, UOM:'SFt'}
        },
        {
            poValue: 'Cornice works',
            name: "Cornice works",
            checkLists: [
                { name: "Straightness", type: checkList.checkBox},
                { name: "Damage", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: '',
            name: "Primer application",
            checkLists: [
                { name: "Surface finish", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: 'Carpentry', // TODO
        },
        {
            poValue: 'CP Fittings', // TODO
        },
        {
            name: '', // TODO
            poValue:'Utility equipment installation'
        },
        {
            poValue: '',
            name:'Electrical switch installation',
            checkLists: [
                { name: "Aligment", type: checkList.checkBox},
                { name: "Allotment of switches", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: '',
            name:'Internal Paint application',
            checkLists: [
                { name: "Mixing check", type: checkList.checkBox},
                { name: "Surface finish", type: checkList.checkBox},
                { name: "Protection", type: checkList.checkBox},
              ],
            measurement:  measurements.SqM
        },
        {
            poValue: '',
            name:'External Paint application',
            checkLists: [
                { name: "Mixing check", type: checkList.checkBox},
                { name: "Surface finish", type: checkList.checkBox},
                { name: "Protection", type: checkList.checkBox},
              ],
            measurement:  measurements.SqM
        },
        {
            poValue: '',
            name:'Structural paint application',
            checkLists: [
                { name: "Surface finish", type: checkList.checkBox},
              ],
            // measurement:  measurements. TODO
        },
        {
            poValue: '',
            name:'DB and panels',
            checkLists: [
                { name: "Connectivity check for DG ", type: checkList.checkBox},
                { name: "Connectivity check for UPS", type: checkList.checkBox},
                { name: "Connectivity check for Main lines", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT 
        },
        {
            poValue: '',
            name:'Earthing',
            checkLists: [
                { name: "Earting value", type: checkList.checkBox},
              ],
            measurement:  measurements.EARTHING 
        },
        {
            poValue: '',
            name:'Earthing',
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "gloves", type: checkList.checkBox},
              ],
            // measurement:  measurements.EARTHING TODO
        },
        {
            poValue: '', // TODO
            name:'Home automation',
            checkLists: [],
            // measurement:  measurements.EARTHING TODO
        },
        {
            poValue: '', 
            name:'Furniture placement',
            checkLists: [  { name: "Alignment", type: checkList.checkBox},
                { name: "gloves", type: checkList.checkBox},
              ],
            // measurement:  measurements.EARTHING TODO
        },
    ]

const actvityTrimmed = acitivity.map(act=>{
    return {...act, poValue:""}
})


console.log(actvityTrimmed)