import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarQuickFilter,
    GridToolbarFilterButton,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlots,
} from "@mui/x-data-grid";
import {
    randomId,
} from "@mui/x-data-grid-generator";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

import axiosInstance from "../Common/axios";

import { useSnackbar } from "../../contexts/SnackbarContext";

const statuses = ['approved', 'pending', 'connected'];

const initialRows: GridRowsProp = []


interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [{ id, name: "", age: "", isNew: true }, ...oldRows]);
        setRowModesModel((oldModel) => ({
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
            ...oldModel,
        }));

    };

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
            }}
        >
            <GridToolbarFilterButton></GridToolbarFilterButton>
            <GridToolbarQuickFilter></GridToolbarQuickFilter>
            <div>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Add record
                </Button>
            </div>
        </div>
    );
}

export default function UsersTable() {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {}
    );

    const nav = useNavigate();
    const { showMessage } = useSnackbar();

    React.useEffect(() => {

        const isAuth = localStorage.getItem("accessToken");

        if (!isAuth) {
            nav("/login");
        }

        axiosInstance
            .get('/api/applications/')
            .then((response) => {
                const formattedRows: any = response.data.results.map((applicationData: { id: any; application: { applicant: { username: any; gender: any; district: any; state: any; pincode: any; }; applicant_ownership: any; govt_id_type: any; id_number: any; category: any; load_applied: any; date_of_application: any; date_of_approval: any; }; modified_date: any; status: any; reviewer: { username: any; }; reviewer_comments: any; }) => ({
                    id: applicationData.id,
                    applicant_name: applicationData.application.applicant.username,
                    gender: applicationData.application.applicant.gender,
                    district: applicationData.application.applicant.district,
                    state: applicationData.application.applicant.state,
                    pincode: applicationData.application.applicant.pincode,
                    ownership: applicationData.application.applicant_ownership,
                    govt_id_type: applicationData.application.govt_id_type,
                    id_number: applicationData.application.id_number,
                    category: applicationData.application.category,
                    load_applied: applicationData.application.load_applied,
                    date_of_application: applicationData.application.date_of_application,
                    date_of_approval: applicationData.application.date_of_approval || 'N/A', // Assuming 'N/A' if null
                    modified_date: applicationData.modified_date,
                    status: applicationData.status,
                    reviewer_name: applicationData.reviewer.username,
                    reviewer_comments: applicationData.reviewer_comments
                }));
                setRows(formattedRows);
            }).catch(() => showMessage('Failed to fetch application details please try again', 'error'))


    }, []);



    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    };

    const handleDeleteClick = (id: GridRowId) => () => {
        axiosInstance.delete(`/api/track_application?id=${id}`).then((res) => {
            setRows(rows.filter((row) => row.id !== id));
            showMessage('Successfully deleted the Application', 'success');
        }).catch((e) => {
            showMessage('Failed to delete the Application. Please try again', 'error');
        })
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        console.log(newRow)
        if (newRow.status === "approved") {
            let currentDate = new Date()
            newRow.date_of_approval = currentDate.toISOString().split('T')[0]
        }
        axiosInstance.patch('/api/track_application/', newRow).then((res) => {
            showMessage('Successfully updated the application status', 'success');
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        }).catch((e) => {
            showMessage('Failed to while updating the application status. Please try again', 'error');
        });
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        { field: 'applicant_name', headerName: 'Applicant Name', width: 150, editable: true },
        { field: 'gender', headerName: 'Gender', width: 100, editable: false },
        { field: 'district', headerName: 'District', width: 130, editable: false },
        { field: 'state', headerName: 'State', width: 130, editable: false },
        { field: 'pincode', headerName: 'Pincode', width: 100, editable: false },
        { field: 'ownership', headerName: 'Ownership', width: 130, editable: false },
        { field: 'govt_id_type', headerName: 'Govt ID Type', width: 150, editable: false },
        { field: 'id_number', headerName: 'ID Number', width: 150, editable: false },
        { field: 'category', headerName: 'Category', width: 130, editable: false },
        { field: 'load_applied', headerName: 'Load Applied (KV)', width: 100, editable: false },
        { field: 'date_of_application', headerName: 'Date of Application', width: 130, editable: false },
        { field: 'date_of_approval', headerName: 'Date of Approval', width: 150, editable: false },
        { field: 'modified_date', headerName: 'Modified Date', width: 150, editable: false },
        { field: 'status', headerName: 'Status', width: 130, editable: true, type: 'singleSelect', valueOptions: statuses },
        { field: 'reviewer_name', headerName: 'Reviewer Name', width: 150, editable: false },
        { field: 'reviewer_comments', headerName: 'Reviewer Comments', width: 200, editable: true },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            headerClassName: "super-app-theme--header",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={
                                handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <>
            <Navbar></Navbar>
            <Box
                sx={{
                    width: "auto",
                    padding: 2.5,
                    "& .actions": {
                        color: "text.secondary",
                    },
                    "& .textPrimary": {
                        color: "text.primary",
                    },
                }}
            >
                <DataGrid
                    sx={{
                        paddingTop: 2,
                        '& .super-app-theme--header': {
                            fontSize: '16px',
                            fontWeight: 'bold',

                        }
                    }}
                    rows={rows}
                    rowHeight={45}
                    columns={columns}
                    // pageSizeOptions={[5, 10]}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    initialState={{
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterValues: [""],
                            },
                        },
                    }}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar as GridSlots["toolbar"],
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                />
            </Box>
        </>

    );
}