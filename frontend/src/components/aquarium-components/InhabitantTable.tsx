// InhabitantTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface InhabitantTableProps<T> {
  data: T[];
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowClick: (item: T) => void;
  onSelectItem: (item: T) => void;
  isItemSelected: (item: T) => boolean;
  columns: { field: keyof T; headerName: string }[];
  addButtonColor: 'primary' | 'secondary';
}

const InhabitantTable = <T extends { name: string }>({
  data,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  onRowClick,
  onSelectItem,
  isItemSelected,
  columns,
  addButtonColor,
}: InhabitantTableProps<T>) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.field)} sx={{ fontWeight: 'bold' }}>
                  {col.headerName}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Add</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow
                  key={item.name}
                  hover
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: isItemSelected(item)
                      ? 'rgba(0, 123, 255, 0.1)'
                      : 'inherit',
                  }}
                  onClick={() => onRowClick(item)}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.field)}>
                      {String(item[col.field] ?? '')}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectItem(item);
                      }}
                      color={isItemSelected(item) ? 'secondary' : addButtonColor}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default InhabitantTable;
