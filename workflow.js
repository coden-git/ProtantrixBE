const { type } = require('os');

const masters = {
    mixingRatios: [{ label: 'M5', value: 'M5', meta: "1 Cement, 5 Sand, 10 Coarse aggregate",  id:1 }, { label: 'M7.5', value: 'M7.5', meta: "1 Cement, 4 Sand, 8 Coarse aggregate", id:2 }], // others
    reinforcementWeights: [{ label: '6', value: 0.22, id:1 }, { label: '8', value: 0.395, id:2 }],
    mortarsRatio: [{ label: '1:6', value: '1:6', id:1 }, { label: '1:7', value: '1:7',id:2 }], // others
    pvcPlumbingPressure: [{ label: '1/8', value: 1230, id:1 }, { label: '1/4', value: 1130,id:2 }], // others //TODO
    pvcPlumbing: [{ label: '1/8', value: '1/8', id:1 }, { label: '1/4', value: '1/4',id:2 }, { label: '3/8', value: '3/8',id:3 }, { label: '1/2', value: '1/2',id:4 }], // others //TODO
    cpvcPlumbing: [{ label: '1/2 - 2 Class 1', value: '1/2 - 2 Class 1', id:1 }, { label: '1/2 - 2 Class 2', value: '1/2 - 2 Class 2', id:2 }], // others //TODO
    acCopperDia: [{ label: '1/8 3.175', value: '1/8 3.175', id:1 }, { label: '1/4 6.35', value: '1/4 6.35',id:2 }], // others //TODO
    conduitSizing: [{label:'20', value:20}, {label:'25', value:25}],
    switchBoxes: [{label:'1 module plate', value:'1 module plate'}, {label:'2 module plate', value:'2 module plate'}],
    leakTestDays: 10,
    excavation: [{ label: '0-1.5m', value: '0-1.5m', id:1 }, { label: '1.5-3m', value: '1.5-3m', id:2 }],
    cubeCastDays: [{ label: '14th Day M5',  meta: "1 Cement, 5 Sand, 10 Coarse aggregate", value: 14, id:1 }, { label: '28th Day M5', value: 28, meta: '1 Cement, 5 Sand, 10 Coarse aggregate', id:2 }, { label: '14th Day 7.5', value: 14, id:3, meta:'1 Cement, 4 Sand, 8 Coarse aggregate' }, { label: '28th Day 7.5', value: 28, id:4, meta: '1 Cement, 4 Sand, 8 Coarse aggregate' }],
    masionry: [{ label: '100mm', value: '100mm', id:1 }, { label: '150mm', value: '150mm', id:2 }, { label: '200mm', value: '200mm', id:3 }, { label: '230mm', value: '230mm', id:4 }],
    structuralSteel: [{ label: 'MS Angle 20*20*3', value: '0.9', id:1 }, { label: 'MS Beams ISLB 100*50', value: '8', id:2 }, { label: 'MS Channel 75*40', value: '6.8', id:3 }],
    electricalCabling: [{ label: '20 mm', value: '20 mm', id:1 }, { label: '25 mm', value: '25 mm', id:2 }, { label: '32 mm', value: '32 mm', id:3 }, { label: '40 mm', value: '40 mm', id:4 }],
    ccTvCabling: [{ label: '20 mm', value: '20 mm', id:1 }, { label: '25 mm', value: '25 mm', id:2 }, { label: '32 mm', value: '32 mm', id:3 }, { label: '40 mm', value: '40 mm', id:4 }],
    falseCeilingTypes: [{ label: 'Gypsum board', value: 'Gypsum board', id:1 }, { label: 'Mineral fiber', value: 'Mineral fiber', id:2 }, { label: 'PVC panels', value: 'PVC panels', id:3 }],  
    internalPaint: [{ label: 'Apex Ultima', value: 'Apex Ultima', id:1 }, { label: 'Nerolac Excel Mica', value: 'Nerolac Excel Mica', id:2 }, { label: 'Asian Paint Royale Aspira', value: 'Asian Paint Royale Aspira', id:3 }],
    }


const measurements = {
    LOT: {
        UOM: 'LOT',
        value: "",  
        type: "LOT"
    },
    CUM: {
        name: 'L*B*H',
        UOM: 'CUM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Name' }, { type: 'label', value: 'Length (m)' }, { type: 'label', value: 'Breadth' }, { type: 'label', value: 'height' }, { type: 'label', value: 'total (cum)' }],
            [{ type: 'text', value: '' }, { type: 'number', value: '' }, { type: 'number', value: '' }, { type: 'number', value: '' }, { type: 'label', computeType: 'COMPUTE', formula: "*" }]
        ],
        type: "table",
        finalTotal: "total"
    },
    CUM_MIXING: { 
        name: 'L*B*H',
        UOM: 'CUM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Name' }, { type: 'label', value: 'Length (m)' }, { type: 'label', value: 'Breadth (m)' }, { type: 'label', value: 'Height (m)' }, { type: 'label', value: 'Total (cum)' }],
            [{ type: 'dropdown', value: '', options: masters.mixingRatios }, { type: 'number', value: '' }, { type: 'number', value: '' }, { type: 'number', value: '' }, { type: 'label', computeType: 'COMPUTE', formula: "*" }]
        ],
        finalTotal: "name",
        type: "table"
    },
    CUM_EXCAVATION: { 
        name: 'L*B*H',
        UOM: 'CUM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Name' }, { type: 'label', value: 'Length (m)' }, { type: 'label', value: 'Breadth (m)' }, { type: 'label', value: 'Height (m)' }, { type: 'label', value: 'Total (cum)' }],
            [{ type: 'dropdown', value: '', options: masters.excavation }, { type: 'number', value: '' }, { type: 'number', value: '' }, { type: 'number', value: '' }, { type: 'label', computeType: 'COMPUTE', formula: "*" }]
        ],
        finalTotal: "name",
        type: "table"
    },

    KgsDia: {
        name: 'Running meter Kgs',
        UOM: 'KGs',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Dia' }, { type: 'label', value: 'Length (m)' }, { type: 'label', value: 'total (kgs)' }],
            [{ type: 'dropdown', value: '', options: masters.reinforcementWeights }, { type: 'number', value: '' },  { type: 'label', computeType: 'COMPUTE_VALUE', formula: "*" }]
        ],
        finalTotal: "total",
        type: "table"
    },
    SqM: {
        name: 'l*b',
        UOM: 'SqM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Name' }, { type: 'label', value: 'Length (m)' ,},{ type: 'label', value: 'Breadth (m)' }, { type: 'label', value: 'total (kgs)' }],
            [{ type: 'text', value: '', }, { type: 'number', value: '' }, { type: 'number', value: '' }, { type: 'label', computeType: 'COMPUTE', formula: "*" }]
        ],
        finalTotal: "total",
        type: "table"
    },
    SqM_MASONRY: {
        name: 'l*b',
        UOM: 'SqM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Name' }, { type: 'label', value: 'Length (m)' ,},{ type: 'label', value: 'Breadth (m)' }, { type: 'label', value: 'total (kgs)' }],
            [{ type: 'dropdown', value: '', options: masters.masionry }, { type: 'number', value: '' }, { type: 'number', value: '' }, { type: 'label', computeType: 'COMPUTE', formula: "*" }]
        ],
        finalTotal: "name",
        type: "table"
    },
    RM_PLUM: {
        name: 'Length',
        UOM: 'RM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Diameter' }, { type: 'label', value: 'Length (m)' }],
            [{ type: 'dropdown', value: '',options: masters.pvcPlumbing }, { type: 'number', value: '' }]
        ],
        finalTotal: false,
        type: "table"
    },
    RM_CPVC: {
        name: 'Length',
        UOM: 'RM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Diameter' }, { type: 'label', value: 'Length (m)' }],
            [{ type: 'dropdown', value: '',options: masters.cpvcPlumbing }, { type: 'number', value: '' }]
        ],
        finalTotal: false,
        type: "table"
    },
    RM_CONDUIT: {
        name: 'Length',
        UOM: 'RM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Size' }, { type: 'label', value: 'Length (m)' }],
            [{ type: 'dropdown', value: '',options: masters.conduitSizing }, { type: 'number', value: '' }]
        ],
        finalTotal: "name",
        type: "table"
    },
    SWITCH_COUNT: {
        name: 'Switch Count',
        UOM: 'Nos',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Size' }, { type: 'label', value: 'Nos' }],
            [{ type: 'dropdown', value: '',options: masters.switchBoxes }, { type: 'number', value: '' }]
        ],
        finalTotal: "name",
        type: "table"
    },
    AC_CONDUIT:{
        name: 'AC Conduit',
        UOM: 'RM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Size' }, { type: 'label', value: 'Meter' }],
            [{ type: 'dropdown', value: '',options: masters.acCopperDia }, { type: 'number', value: '' }]
        ],
        finalTotal: "name",
        type: "table"
    },
    EARTHING: {
        name: 'Earthing values',
        UOM: 'Nos',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'type' }, { type: 'label', value: 'location' },  { type: 'label', value: 'value' }],
            [{ type: 'text', value: ''}, { type: 'text', value: '' }, { type: 'number', value: '' }]
        ],
        finalTotal: false,
        type: "table"
    },
    SAME_AS_PO: "SAME_AS_PO",
    STRUCTURAL_STEEL: {
        name: 'Structural Steel',
        UOM: 'Kg',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Name' }, { type: 'label', value: 'Meters' }],
            [{ type: 'dropdown', value: '',options: masters.structuralSteel }, { type: 'number', value: '' }]
        ],
        finalTotal: "total",
        type: "table"
    },
    RM_ELECTRICAL: {
        name: 'Length',
        UOM: 'RM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Diameter' }, { type: 'label', value: 'Length (m)' }],
            [{ type: 'dropdown', value: '',options: masters.electricalCabling }, { type: 'number', value: '' }]
        ],
        finalTotal: false,
        type: "table"
    },
    RM_CCTV: {
        name: 'Length',
        UOM: 'RM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Diameter' }, { type: 'label', value: 'Length (m)' }],
            [{ type: 'dropdown', value: '',options: masters.ccTvCabling }, { type: 'number', value: '' }]
        ],
        finalTotal: false,
        type: "table"
    },
    FALSE_CEILING_SUPPORT:{
        name: 'False Ceiling Support',
        UOM: 'Nos',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Support' }, { type: 'label', value: 'Quantity' }],
            [{ type: 'text', value: '' }, { type: 'number', value: '' }]
        ],
        finalTotal: "name",
        type: "table"
    },
    FALSE_CEILING:{
        name: 'False Ceiling',
        UOM: 'SqM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Type' }, { type: 'label', value: 'Quantity' }],
            [{ type: 'dropdown', value: '', options: masters.falseCeilingTypes }, { type: 'number', value: '' }]
        ],
        finalTotal: "name",
        type: "table"
    },
    FRAMING:{
        name: 'Framing',
        UOM: 'NOs',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'L X B' }, {type:'label', value:'Nos'}],
            [{ type: 'text', value: '', disabled:true}, { type: 'number', value: '' }]
        ],
        finalTotal: "name",
        type: "table"
    },
    PAINT_INTERNAL:{
        name: 'Internal Paint',
        UOM: 'SqM',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'Type' }, { type: 'label', value: 'Quantity' }],
            [{ type: 'dropdown', value: '', options: masters.internalPaint }, { type: 'number', value: '' }]
        ],
        finalTotal: "name",
        type: "table"
    },
    ELECTRICAL_FITTINGS: {
        name: 'Electrical Fittings',
        UOM: 'Nos',
        isMulti: true,
        data: [
            [{ type: 'label', value: 'item name' }, { type: 'label', value: 'location' },  { type: 'label', value: 'Nos' }],
            [{ type: 'text', value: ''}, { type: 'text', value: '' }, { type: 'number', value: '' }]
        ],
        finalTotal: "total",
        type: "table"
    },
}
const leakTestTable = [
    [
        {
            type:'label',
            value: 'Name'
        },
        {
            type:'label',
            value: 'Pressure'
        },
        {
            type:'label',
            value: 'Duration (mins)'
        },
        {
            type:'label',
            value: 'Image'
        },
    ],
    [
        {
            type:'dropdown',
            value: '',
            options:masters.pvcPlumbingPressure
        },
        {
            type:'number',
            value: '',
            validation:{formula:'<'}
        },
        {
            type:'number',
            value: ''
        },
        {
            type:'image',
            value: ''
        },
    ],
];

const leakTestTableAC = [
    [
        {
            type:'label',
            value: 'Name'
        },
        {
            type:'label',
            value: 'Pressure'
        },
        {
            type:'label',
            value: 'Duration (mins)'
        },
        {
            type:'label',
            value: 'Image'
        },
    ],
    [
        {
            type:'dropdown',
            value: '',
            options: masters.pvcPlumbingPressure
        },
        {
            type:'number',
            value: '',
            validation:{formula:'<'}
        },
        {
            type:'number',
            value: ''
        },
        {
            type:'image',
            value: ''
        },
    ],
];

const cubeCastTable = [
    [
        {
            type:'label',
            value: 'Mixing Ratio,'
        },
        
        {
            type:'label',
            value: 'Current Value'
        },
        {
            type:'label',
            value: 'Image'
        }
        
    ],
    [
        {
            type:'dropdown',
            value: '',
            options: masters.cubeCastDays
        },
        {
            type:'number',
            value: '',
            validation:{formula:'<'}
        },
        {
            type: 'image',
            value: ''
        }
    ]
];

const pressureTable = [
    [
        {
            type:'label',
            value: 'Pipe size'
        },
        {
            type:'label',
            value: 'Pressure'
        },
        {
            type:'label',
            value: 'Duration'
        },
        {
            type:'label',
            value: 'Image'
        }
    ],
    [
        {
            type:'dropdown',
            value: '',
            options: masters.pvcPlumbingPressure
        },
        {
            type:'number',
            value: '',
            validation:{formula:'<'}
        },
        {
            type: 'number',
            value: ''
        },
        {
            type: 'image',
            value: ''
        }
    ]
];




const checkList = {
    checkBox: {
        name: '$name',
        "type": "checkbox",
        value: '',
        "isRequired": true
    },
    dropdown: {
        name: '$name',
        "type": "Dropdown",
        "isRequired": true,
        value: '',
        options:[]
    },
    table: {
        name: '$name',
        "type": "Table",
        "isRequired": true,
        isMulti: true,
        value: [],
    },
    dateRange: {
        name: '$name',
        "type": "DateRange",
        "isRequired": true,
        value: {to:'', from:''},
        validation: masters.leakTestDays
    },
    upload: {
        name: '$name',
        "type": "FileUpload",
        "isRequired": true,
        mimeTypes: ['application/pdf', 'image/*'],
        value: '',
    }
}

const createActivityData = () => {

    const acitivity = [
        {
            name: 'Documentation',
            poValue: [],
            poTrigger: null,
            checkLists: [
                { name: "Soil test report", type: checkList.checkBox },
                { name: "Site survey", type: checkList.checkBox },
                { name: "Structural drawings", type: checkList.checkBox },
                { name: "Statutory permissions", type: checkList.checkBox },
                { name: "Plan and elevation", type: checkList.checkBox },
                { name: "EHS work permits", type: checkList.checkBox },
                { name: "pvc plumbing and electrical drawing", type: checkList.checkBox },
                { name: "BOQ - Bill of quantities", type: checkList.checkBox },
                { name: "Project schedule", type: checkList.checkBox },
                { name: "QMS Document upload", type: checkList.upload },
                { name: "Warranty certificates upload", type: checkList.upload }

            ],
            measurement: measurements.LOT
        },
        {
            name: 'Site marking',
            poValue: [],
            checkLists: [
                { name: "Drawing Dimension check", type: checkList.checkBox },
            ],
            poTrigger: null,
            measurement: measurements.LOT
        },
        {
            name: 'Level marking',
            poValue: [],
            poTrigger: null,
            checkLists: [
                { name: "Road/FFL level check", type: checkList.checkBox },
            ],
            measurement: measurements.LOT
        },
        {
            name: 'Excavation',
            poValue: masters.excavation.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists: [
                { name: "Level check", type: checkList.checkBox },
            ],
            measurement: measurements.CUM_EXCAVATION
        },
        {
            name: 'Footing PCC',
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists: [
                { name: "Level check", type: checkList.checkBox },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true },
                { name: "Curing (3 days)", type: checkList.checkBox, isRequired:false }
            ],
            measurement: measurements.CUM_MIXING
        },
        {
            name: 'Footing reinforcement',
            poValue: [{label:"Footing reinforcement", value:100}],
            poTrigger: "value",
            checkLists: [
                { name: "Dimension check", type: checkList.checkBox },
                { name: "Rust check", type: checkList.checkBox },
                { name: "Cover Block check", type: checkList.checkBox }
            ],
            measurement: measurements.KgsDia
        },
        {
            name: 'Column reinforcement',
            poValue: [{label:"Column reinforcement", value:100}],
            poTrigger: "value",
            checkLists:  [
                { name: "Plumb", type: checkList.checkBox },
                { name: "Alignment", type: checkList.checkBox }
              ],
            measurement: measurements.KgsDia
        },
        {
            name: 'Shuttering',
            poValue: [{label:"Shuttering", value:100}],
            poTrigger: "value",
            checkLists:  [
                { name: "Plumb and alignment", type: checkList.checkBox },
                { name: "Concrete cover", type: checkList.checkBox }
              ],
            measurement: measurements.SqM
        },
        {
            name: 'Footing concrete (RCC)',
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists:  [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing", type: checkList.checkBox, isRequired:false },
                { name: "Cube cast", type: checkList.checkBox }, 
                { name: "Cube test", type: {...checkList.table, isRequired:false},  value:cubeCastTable},
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true }
              ],
            measurement: measurements.CUM_MIXING
        },
        {
            name: 'Column marking',
            poValue: [],
            checkLists:  [
                { name: "Dimension check", type: checkList.checkBox },
              ],
            measurement: measurements.LOT  
        },
        {
            name: 'Column shuttering',
            poTrigger: "value",
            poValue: [{label:"Column shuttering", value:100}],
            checkLists:  [
                { name: "Cover and plumb check", type: checkList.checkBox },
              ],
            measurement: measurements.SqM  
        },
        {
            name: 'Column concrete',
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists:  [
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true },
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Cube cast", type: checkList.checkBox },
                {name: "Cube test", type: {...checkList.table, isRequired:false}, value:cubeCastTable},
                { name: "Curing", type: checkList.checkBox, isRequired: false }
              ],
            measurement: measurements.CUM_MIXING 
        },
        {
            name: 'Foundation Backfilling',
            poValue: [{label:"Foundation Backfilling", value:100}],
            poTrigger: "value",
            checkLists:  [
                { name: "600 mm per fill with compactor", type: checkList.checkBox },
              ],
            measurement: measurements.CUM  
        },
        {
            name: 'Size Stone PCC',
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists:  [
                { name: "Mud mix", type: checkList.checkBox },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, isMulti: true, displayMeta: true },
                { name: "Curing", type: checkList.checkBox, isRequired:false }
              ],
            measurement: measurements.CUM_MIXING  
        },
        {
            name: 'Stone Masonry',
            poValue: [{label:"Stone Masonry", value:100}],
            checkLists:  [
                { name: "Alignment", type: checkList.checkBox },
                { name: "Dimension check", type: checkList.checkBox },
                { name: "Level check", type: checkList.checkBox },
                { name: "Curing", type: checkList.checkBox, isRequired: false},
                { name: "Mortar Ratio", type: checkList.dropdown, options:masters.mortarsRatio, displayMeta: true, isMulti: true }
              ],
            measurement: measurements.CUM  
        },
        {
            name: 'Sizestone top PCC',
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists:  [
                { name: "Level Check", type: checkList.checkBox },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, isMulti: true, displayMeta: true },
                { name: "Curing", type: checkList.checkBox, isRequired: false }
              ],
            measurement: measurements.CUM_MIXING
        },
        {
            name: 'Plinth reinforcement',
            poValue: [{label:"Plinth reinforcement", value:100}],
            poTrigger: "value",
            checkLists:  [
                { name: "Dimension check", type: checkList.checkBox },
                { name: "Rust check", type: checkList.checkBox },
                { name: "Alignment", type: checkList.checkBox }
              ],
            measurement: measurements.KgsDia  
        },
        {
            name: 'Plinth shuttering',
            poValue: [{label:"Plinth shuttering", value:100}],
            poTrigger: "value",
            checkLists:  [
                { name: "Plumb and alignment", type: checkList.checkBox },
                { name: "Concrete cover", type: checkList.checkBox }
              ],
            measurement: measurements.SqM  
        },
        {
            name: 'Plinth concrete',
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists: [
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true },
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Cube cast", type: checkList.checkBox },
                {name: "Cube test", type: {...checkList.table, isRequired:false}, value:cubeCastTable},
                { name: "Curing", type: checkList.checkBox, isRequired: false }
              ],
            measurement: measurements.CUM_MIXING
        },
        {
            name: 'Floor Backfilling',
            poValue: [{label:"Floor Backfilling", value:100}],
            checkLists: [
                { name: "Compaction for 6 days", type: checkList.checkBox },
                ],
            measurement: measurements.LOT  
        },
        {
            name: 'Drain Plumbing',
            poValue: masters.pvcPlumbing.map(e=>({ label: e.label, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists: [
                { name: "Position check", type: checkList.checkBox },
                { name: "Slope test", type: checkList.checkBox },
                { name: "End Caps", type: checkList.checkBox },
                { name: "Leak test", type: checkList.table, value: pressureTable  }
              ]
              ,
            measurement: {...measurements.RM_PLUM, finalTotal: "name"}
        },
        {
            name: 'Plumbing backfilling with Msand',
            poValue: [{label:"Plumbing backfilling with Msand", value:100}],
            poTrigger: "value",
            checkLists: [
                { name: "Compaction", type: checkList.checkBox },
              ]
              ,
            measurement: measurements.CUM  
        },
        {
            name: 'Anti termite coating',
            poValue: [{label:"Anti termite coating", value:100}],
            poTrigger: "value",
            checkLists: [
                { name: "Quantity", type: checkList.checkBox },
                { name: "Rain Proof", type: checkList.checkBox },
              ],
            measurement: measurements.SqM  
        },
        {
            name: 'Soling / Wetmix',
            poValue: [{label:"Soling / Wetmix", value:100}],
            checkLists: [
                { name: "Level check", type: checkList.checkBox },
                { name: "compaction", type: checkList.checkBox },
              ]
              ,
            measurement: measurements.CUM  
        },
        {
            name: 'Block Masonry',
            poValue: masters.masionry.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists: [
                { name: "Block wetting", type: checkList.checkBox },
                { name: "plumb and right angle", type: checkList.checkBox },
                { name: "Mortar Ratio", type: checkList.dropdown, options:masters.mortarsRatio, displayMeta: true, isMulti: true }
              ],
            measurement: measurements.SqM_MASONRY
        },
        {
            name: 'Brick Masonry',
            poValue: masters.masionry.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists: [
                { name: "Block wetting", type: checkList.checkBox },
                { name: "plumb and right angle", type: checkList.checkBox },
                { name: "Mortar Ratio", type: checkList.dropdown, options:masters.mortarsRatio, displayMeta: true, isMulti: true }
              ]
              ,
            measurement: measurements.SqM_MASONRY  
        },
        {
            name: 'Laterite Masonry',
            poValue: [{label:"Laterite Masonry", value:100}],
            poTrigger: "value",
            checkLists: [
                { name: "Block wetting", type: checkList.checkBox },
                { name: "plumb and right angle", type: checkList.checkBox },
                { name: "Mortar Ratio", type: checkList.dropdown, options:masters.mortarsRatio, displayMeta: true, isMulti: true }
              ]
              ,
            measurement: measurements.SqM  
        },
        {
            name: 'Lintel Concrete',
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists: [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing 7days", type: checkList.checkBox, isRequired:false },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true }
              ],
            measurement: measurements.CUM_MIXING  
        },
        {
            name: 'Chajja Concrete',
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists: [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing 7days", type: checkList.checkBox, isRequired:false },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true }
              ],
            measurement: measurements.CUM_MIXING
        },
        {
            name: 'Slab shuttering	',
            poValue: [{label:"Slab shuttering", value:100}],
            poTrigger: "value",
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
            poValue: [{label:"Slab reinforcement", value:100}],
            poTrigger: "value",
            checkLists: [
                { name: "Cover blocks", type: checkList.checkBox },
                { name: "Chair laying", type: checkList.checkBox },
                { name: "Dimension check", type: checkList.checkBox, },
              ],
            measurement: measurements.KgsDia  
        },
        {
            name: 'Slab conduiting',
            poValue: masters.conduitSizing.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
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
            name: "Slab Concrete",
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            checkLists: [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing 15days", type: checkList.checkBox, isRequired:false },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true },
                { name: "Cube cast", type: checkList.checkBox },
                { name: "Cube test", type: {...checkList.table, isRequired:false}, value:cubeCastTable},
              ]
              ,
            measurement: measurements.CUM_MIXING
        },
        {
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "Deck sheet concrete",
            checkLists: [
                { name: "Vibrator", type: checkList.checkBox },
                { name: "Honey comb", type: checkList.checkBox },
                { name: "Curing 15days", type: checkList.checkBox, isRequired:false },
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true },
                { name: "Cube cast", type: checkList.checkBox },
                { name: "Cube test", type: {...checkList.table, isRequired:false}, value:cubeCastTable},
                { name: "L-Flashing and expansion joints", type: checkList.checkBox }, 
              ]
              ,
            measurement: measurements.CUM_MIXING
        },
        {
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "Column Extension",
            checkLists: [
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true },
                { name: "Lapping check", type: checkList.checkBox }, 
              ]
              ,
            measurement: measurements.CUM_MIXING  
        },
        {
            poValue: [{label:"Slab deshuttering", value:100}],
            name: "Slab deshuttering",
            poTrigger: "value",
            checkLists: [
                { name: "Honey comb check", type: checkList.checkBox }, 
              ]
              ,
            measurement: measurements.LOT  
        },
        {
            poValue: [{label:"Roof waterproofing", value:100}],
            poTrigger: "value",
            name: "Roof waterproofing",
            checkLists: [
                { name: "Leak test Resutls", type: checkList.dateRange },
                { name: "Screed slope check", type: checkList.checkBox }, 
              ]
              ,
            measurement: measurements.SqM  
        },
        {
            poValue: masters.conduitSizing.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "Electrical wall conduiting",
            checkLists: [
                { name: "Chasing depth", type: checkList.checkBox },
                { name: "Positioning and dimensions", type: checkList.checkBox },
              ]
              ,
            measurement: measurements.RM_CONDUIT  
        },
        {
            poValue: masters.switchBoxes.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
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
            poValue: [{isCustom:true, value:measurements.FRAMING}],
            poTrigger: "id",
            name: "Frame Fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox },
                { name: "plumb", type: checkList.checkBox },
              ]
              ,
            measurement: measurements.SAME_AS_PO
        },
        {
            poValue: masters.acCopperDia.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "AC Conceals",
            checkLists: [
                { name: "Leak Test", type: checkList.table, value: leakTestTableAC },
                { name: "slope check", type: checkList.checkBox },
              ]
              ,
            measurement:  measurements.AC_CONDUIT
        },
        {
            poValue: [{label:"Wall plastering", value:100}],
            poTrigger: "value",
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
            poValue: [{label:"Structural Fabrication", value:100}],
            poTrigger: "value",
            name: "Structural Fabrication",
            checkLists: [
                { name: "Rust check", type: checkList.checkBox },
                { name: "bend check", type: checkList.checkBox },
                { name: "weighment", type: checkList.checkBox },
                { name: "alignment", type: checkList.checkBox },
                { name: "Welding finish", type: checkList.checkBox },
                { name: "buffing", type: checkList.checkBox },

              ],
            measurement: measurements.STRUCTURAL_STEEL
        },
        {
            poValue: [],
            name: "Steel primer application",
            checkLists: [
                { name: "surface finish", type: checkList.checkBox }

              ],
            measurement:  measurements.LOT
        },
        {
            poValue: [],
            name: "Elevation works",
            checkLists: [
                { name: "Dimension check", type: checkList.checkBox },
                { name: "Curing 7 days", type: checkList.checkBox, isRequired:false },

              ],
            measurement:  measurements.LOT
        },
        {
            poValue: masters.pvcPlumbing.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "CPVC Plumbing",
            checkLists: [
                { name: "Leak test", type: checkList.table, value: leakTestTable },
                { name: "Level check", type: checkList.checkBox },

              ],
            measurement:  measurements.RM_CPVC
        },
        {
            poValue: [{label:"Water proofing", value:100}],
            poTrigger: "value",
            name: "Water proofing and chemical coating upto 1 m",
            checkLists: [
                { name: "Leak test Resutls", type: {...checkList.dateRange, validation: 7} },
                { name: "Leak Test for coating", type: checkList.checkBox },
                { name: "Join filling", type: checkList.checkBox },

              ],
            measurement:  measurements.SqM
        },
        {
            poValue: [{label:"Water proofing screed", value:100}],
            poTrigger: "value",
            name: "Restroom waterproofing screed",
            checkLists: [
                { name: "Leak test Resutls", type: {...checkList.dateRange, validation: 7} },
                { name: "Leak Test for coating", type: checkList.checkBox },
                { name: "Bore Packing", type: checkList.checkBox },

              ],
            measurement:  measurements.SqM
        },
        {
            poValue: masters.pvcPlumbing.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "Washroom Drain Plumbing",
            checkLists: [
                { name: "Slope test", type: checkList.checkBox },
                { name: "Traps", type: checkList.checkBox },
                { name: "Leak test", type: checkList.table, value: leakTestTable },

              ],
            measurement:  measurements.RM_PLUM
        },
        {
            poValue: [{label:"Restroom Sinder filling", value:100}],
            poTrigger: "value",
            name: "Restroom Sinder filling",
            checkLists: [
                { name: "Waterproof damage", type: checkList.checkBox },
              ],
            measurement:  measurements.CUM
        },
        {
            poValue: masters.mixingRatios.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "Restroom concrete ",
            checkLists: [
                { name: "Mixing ratio", type: checkList.dropdown, options: masters.mixingRatios, displayMeta: true, isMulti: true },
              ],
            measurement:  measurements.CUM
        },
        {
            poValue: [{label:"Restroom floor leveling", value:100}],
            poTrigger: "value",
            name: "Restroom floor chemical coating",
            checkLists: [
                { name: "Coving check", type: checkList.checkBox},
              ],
            measurement:  measurements.SqM
        },
        {
            poValue: [{label:"Putty and sanding", value:100}],
            poTrigger: "value",
            name: "Putty and sanding",
            checkLists: [
                { name: "Surface finish", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: masters.electricalCabling.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "electrical cabling",
            checkLists: [
                { name: "No cable joints", type: checkList.checkBox},
                { name: "Guage check", type: checkList.checkBox},
                { name: "Core check", type: checkList.checkBox},
              ],
            measurement:  measurements.RM_ELECTRICAL
        },
        {
            poValue: masters.ccTvCabling.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "CCTV/network cabling",
            checkLists: [
                { name: "No cable joints", type: checkList.checkBox},
                { name: "Guage check", type: checkList.checkBox},
                { name: "Core check", type: checkList.checkBox},
              ],
            measurement:  measurements.RM_CCTV
        },
        {
            poValue: [{label:'Ceiling support', value:100}],
            poTrigger: "value",
            name: "Ceiling Supports",
            checkLists: [
                { name: "Dimension check", type: checkList.checkBox},
                { name: "End Connection Check", type: checkList.checkBox},
              ],
            measurement:  measurements.FALSE_CEILING_SUPPORT
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
            poValue: masters.falseCeilingTypes.map(e=>({ label: e.value, value: 100, id: e.id })),
            poTrigger: "id",
            name: "False ceiling",
            checkLists: [
                { name: "Joint tape", type: checkList.checkBox},
                { name: "Undulations", type: checkList.checkBox},
                { name: "Misc supports", type: checkList.checkBox},
                { name: "Electrical points dimensional check", type: checkList.checkBox},

              ],
            measurement:  measurements.FALSE_CEILING
        },
        {
            poValue: [],
            poTrigger: "value",
            name: "Ceiling putty and sanding",
            checkLists: [
                { name: "Surface Finish", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: [],
            name: "Cement carving works",
            checkLists: [
                { name: "Straightness", type: checkList.checkBox},
                { name: "Damage", type: checkList.checkBox},

              ],
            measurement:  measurements.LOT
        },
        {
            poValue: [],
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
            poValue: [],
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
            poValue: [{label:"Granite Laying", value:100}],
            poTrigger: "value",
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
            poValue: [{label:"Marble Laying", value:100}],
            poTrigger: "value",
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
            poValue: [{label:"Flooring and wall tiles laying", value:100}],
            poTrigger: "value",
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
            poValue: [{label:"Floor cleaning and grouting", value:100}],
            poTrigger: "value",
            name: "Floor cleaning and grouting",
            checkLists: [
                { name: "Grout depth", type: checkList.checkBox},
                { name: "Tile damage", type: checkList.checkBox},
              ],
            measurement:  {...measurements.LOT, UOM:'SFt'}
        },
        {
            poValue: [{label:"Tile Protection", value:100}],
            poTrigger: "value",
            name: "Tile protection",
            checkLists: [
                { name: "Gaps", type: checkList.checkBox},
                { name: "Gumming", type: checkList.checkBox},
              ],
            measurement:  {...measurements.LOT, UOM:'SFt'}
        },
        {
            poValue: [{isCustom:true, value:measurements.FRAMING}],
            name: "Wooden window  fixing",
            poTrigger: "id",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},

              ],
            measurement:  measurements.SAME_AS_PO
        },
        {
            poValue: [{isCustom:true, value:measurements.FRAMING}],
            name: "Alluminium/UPVC window fixing",
            poTrigger: "id",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
              ],
            measurement:  measurements.SAME_AS_PO
        },
        {
            poValue: [{isCustom:true, value:measurements.FRAMING}],
            name: "Wooden door  fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
              ],
            measurement:  measurements.SAME_AS_PO
        },
        {
            poValue: [{isCustom:true, value:measurements.FRAMING}],
            poTrigger: "id",
            name: "Alluminium/WPC door fixing",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "Plumb", type: checkList.checkBox},
                { name: "Free movements of locks", type: checkList.checkBox},
                { name: "silicon caulking", type: checkList.checkBox},
              ],
            measurement:  measurements.SAME_AS_PO
        },
        {
            poValue: [{label:"Glass Glazing", value:100}],
            poTrigger: "value",
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
            poValue: [{label:"Cornice works", value:100}],
            poTrigger: "value",
            name: "Cornice works",
            checkLists: [
                { name: "Straightness", type: checkList.checkBox},
                { name: "Damage", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: [{label:"Primer application", value:100}],
            poTrigger: "value",
            name: "Primer application",
            checkLists: [
                { name: "Surface finish", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: [{label:"Interiors", value:100}],
            poTrigger: "value",
            name: "Interiors",
            checkLists: [
                { name: "Finishing", type: checkList.checkBox},
                { name: "Channel Movements", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: [{label:"CP Fittings", value:100}],
            poTrigger: "value",
            name: "CP Fittings",
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            name: 'Utility equipment installation', // TODO
            poValue:[],
            checkLists: [
                { name: "Pressure test", type: checkList.table, value: leakTestTable },
                { name: "Test certificate", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: [],
            name:'Electrical switch installation',
            checkLists: [
                { name: "Aligment", type: checkList.checkBox},
                { name: "Allotment of switches", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT
        },
        {
            poValue: masters.internalPaint.map(e=>({ label: e.value, value: 100, id: e.id })),
            name:'Internal Paint application',
            poTrigger: "id",
            checkLists: [
                { name: "Mixing check", type: checkList.checkBox},
                { name: "Surface finish", type: checkList.checkBox},
                { name: "Protection", type: checkList.checkBox},
              ],
            measurement:  measurements.PAINT_INTERNAL
        },
        {
            poValue: [{label:"External Paint application", value:100}],
            name:'External Paint application',
            poTrigger: "value",
            checkLists: [
                { name: "Mixing check", type: checkList.checkBox},
                { name: "Surface finish", type: checkList.checkBox},
                { name: "Protection", type: checkList.checkBox},
              ],
            measurement:  {...measurements.LOT, UOM:'SqM'}
        },
        {
            poValue: [{label:"Structural paint application", value:100}],
            poTrigger: "value",
            name:'Structural paint application',
            checkLists: [
                { name: "Surface finish", type: checkList.checkBox},
              ],
            measurement:  {...measurements.LOT, UOM:'kg'}
        },
        {
            poValue: [],
            name:'DB and panels',
            checkLists: [
                { name: "Connectivity check for DG ", type: checkList.checkBox},
                { name: "Connectivity check for UPS", type: checkList.checkBox},
                { name: "Connectivity check for Main lines", type: checkList.checkBox},
              ],
            measurement:  measurements.LOT 
        },
        {
            poValue: [],
            name:'Earthing',
            checkLists: [
                { name: "Earting value", type: checkList.checkBox},
              ],
            measurement:  measurements.EARTHING 
        },
        {
            poValue: [],
            name:'Electrical Fittings',
            checkLists: [
                { name: "Alignment", type: checkList.checkBox},
                { name: "gloves", type: checkList.checkBox},
              ],
            measurement:  measurements.ELECTRICAL_FITTINGS
        },
        {
            poValue: [{label:"Home automation", value:100}], // TODO
            name:'Home automation',
            checkLists: [{
                name: "Commissioning", type: checkList.checkBox
            }],
            measurement:  measurements.LOT
        },
        {
            poValue: [], 
            name:'Furniture placement',
            checkLists: [  { name: "Alignment", type: checkList.checkBox},
                { name: "gloves / movement damage", type: checkList.checkBox},
              ],
            measurement:  {...measurements.LOT, UOM:'Nos'}
        },
    ]
/*

*/
    const result = []
    for (let i = 0; i < acitivity.length; i++) {
        const data = {
            ...acitivity[i],
            // ensure poValue is always an empty string on output
            checkLists: acitivity[i].checkLists?.map((ele, id) => ({ ...ele.type, name: ele.name, options: ele?.options, isRequired: ele.isRequired!=null ? ele.isRequired : true, value : ele.value ? ele.value : ele.type.value, id:id+1 })),
            id: i
        }
        result.push(data)
    }

    const fs = require('fs')
    const path = require('path')
    // replace poValue with poValue for each activity if present

    const projectJson = {
        projectId: "12345",
        projectName: "Sample Project",
        activities: result,       
    }
   

    const outPath = path.join(__dirname, 'activity.json')
    fs.writeFileSync(outPath, JSON.stringify(projectJson, null, 4), 'utf8')
    console.log('Wrote', outPath)
}

createActivityData()


/* 
remove poValue from all activities and replace with poValue

*/