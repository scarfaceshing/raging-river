import React, { useEffect, useState } from 'react';
import { CssBaseline, Container, Typography, withStyles, Grid, Tabs, Tab, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TableSortLabel, TablePagination, Box, Chip } from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'
import { useDemoData } from '@material-ui/x-grid-data-generator';
import moment from 'moment'
import './App.sass';
import { Check } from '@material-ui/icons';

interface Validator {
  value: number,
  data: any[],
  headCells: any[],
  page: number,
  rowsPerPage: number,
  order: string,
  orderBy: string,
  selected: any[]
}

export default class App extends React.Component<{}, Validator>{

  constructor(props: any) {
    super(props);

    this.state = {
      value: 0,
      data: [],
      rowsPerPage: 5,
      page: 0,
      order: 'asc',
      orderBy: 'order_number',
      selected: [],
      headCells: [
        { id: '1', name: 'order_number', label: 'ORDER NUMBER & DATE' },
        { id: '2', name: 'status', label: 'SHIPPING STATUS' },
        { id: '3', name: 'address', label: 'CUSTOMER ADDRESS' },
        { id: '4', name: 'order_value',  label: 'ORDER VALUE' }
      ]
    }
  }

  basicSort = (event: any, newValue: any) => {
    this.setState({value: newValue})
  };

  selectAll = (event: any) => {

  }

  handleChangePage = (event: any, newPage: number) => {
    this.setState({page: newPage})
  };

  handleChangeRowsPerPage = (event: any) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
    this.setState({page: 0})
  };

  stableSort = (array: any[], comparator: any) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  descendingComparator = (a: any, b: any, orderBy: any) => {

    const compareA = a[orderBy];
    const compareB = b[orderBy];

      if (compareB < compareA) {
        return -1;
      }
      if (compareB > compareA) {
        return 1;
    }
    
      return 0;
  }

  handleRequestSort = (name: string) => {
    this.setState({ orderBy: name })
    this.setState({ order: (this.state.order === 'desc' ? 'asc' : 'desc') })
  }

  getComparator = (order: string, orderBy: string) => {
    return order === 'desc' ? (a: any, b: any) => this.descendingComparator(a, b, orderBy) : (a: any, b: any) => -this.descendingComparator(a, b, orderBy);
  }

  Check = (event: any, index: number) => {
    console.log(event)
  }

  isSelected = (name: any) => this.state.selected.indexOf(name) !== -1;

  handleClick = (event:any, name: any) => {
    const selectedIndex = this.state.selected.indexOf(name);
    let newSelected:any = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(this.state.selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(this.state.selected.slice(1));
    } else if (selectedIndex === this.state.selected.length - 1) {
      newSelected = newSelected.concat(this.state.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        this.state.selected.slice(0, selectedIndex),
        this.state.selected.slice(selectedIndex + 1),
      );
    }

    this.setState({selected: newSelected})
  };

  handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const newSelecteds = this.state.data.map((n) => n.order_number);
      this.setState({selected: newSelecteds})
      return;
    }
    
    this.setState({selected: []})

  };

  componentDidMount() {
    let data:any[] = []

    fetch("https://gist.githubusercontent.com/ryanjn/07512cb1c008a5ec754aea6cbbf4afab/raw/eabb4d324270cf0d3d17a79ffb00ff3cfaf9acc3/orders.json").then((res) => res.json()).then(res => {
      this.setState({data: res})
    })
  }

  newData() {
    let data: any = []
    let address: string = "";
    let tab: string = (this.state.value === 0) ? "" : "shipped" ;

    this.state.data.map((item) => {
      address += `${item.customer.address.line1} ${item.customer.address.line2} ${item.customer.address.city} ${item.customer.address.state} ${item.customer.address.zip}`

      data.push({
        "order_number": item.order_number,
        "oddate": item.order_details.date,
        "sddate": item.shipping_details.date,
        "address": address,
        "status": item.status,
        "order_value": item.order_details.value
      })

      address = ""
    })

    return data
  }


  public render() {
    return (
      <>
    <React.Fragment>
      <CssBaseline />
        <Container maxWidth="lg">
          <Grid xs={12}>
            <Typography variant="h6" id="tableTitle" component="div">
              <span style={{color: '#6E6893'}}>ORDERS</span>
            </Typography>
            </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Tabs
                  value={this.state.value}
                  onChange={this.basicSort}
                  indicatorColor="primary"
                  textColor="primary"
                >
                <Tab label="All" />
                <Tab label="Shipped" />
                </Tabs>
            </Grid>
            <Grid item xs={6}>
              <Typography align={'right'} variant="h6" id="tableTitle" component="div">
                <span style={{color: '#6E6893'}}>Total orders:</span> <span style={{color: '#6D5BD0', fontWeight: 'bold'}}>$900.00</span> <span style={{color: '#6E6893'}}>USD</span>
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid xs={12}>
            <div style={{ height: 400, width: '100%', paddingTop: '30px' }}>
              <div style={{ display: 'flex', height: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                  <Paper>
                  <TableContainer>
                    <Table size={'small'} aria-label="simple table">
                      <TableHead className="thead">
                          <TableRow>
                            <TableCell>
                              <Checkbox
                                indeterminate={this.state.selected.length > 0 && this.state.selected.length < this.newData().length}
                                checked={this.newData().length > 0 && this.state.selected.length === this.newData().length}
                                onChange={this.handleSelectAllClick}
                              />
                            </TableCell>
                            {this.state.headCells.map((headCell) => (
                              <TableCell>
                                <TableSortLabel style={{color: '#6E6893'}} direction={(this.state.order === 'asc') ? this.state.order : 'desc'} onClick={() => {this.handleRequestSort(headCell.name)}}>
                                  {headCell.label}
                                </TableSortLabel>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                      <TableBody>
                          {this.stableSort(this.newData(), this.getComparator(this.state.order, this.state.orderBy)).slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row: any, index: number) => {
                             const isItemSelected = this.isSelected(row.order_number);
                          
                            return (
                              <TableRow onClick={(event) => this.handleClick(event, row.order_number)} key={row.order_number} selected={isItemSelected} >
                                <TableCell>
                                  <Checkbox checked={isItemSelected} />
                                </TableCell>
                                <TableCell scope="row">
                                  <Grid xs={12}>
                                    <Grid xs={12} style={{color: '#00000', fontWeight: 'bold'}}>
                                      # {row.order_number}
                                    </Grid>
                                    <Grid xs={12}>
                                      Ordered: {moment(row.oddate).format('ll')}
                                    </Grid>
                                  </Grid>
                                </TableCell>
                                <TableCell>
                                  <Grid xs={12}>
                                    <Grid xs={12}>
                                      <Chip label={row.status}></Chip>
                                    </Grid>
                                    <Grid xs={12}>
                                      {moment(row.sddate).format('D/MMM/YYYY')}
                                    </Grid>
                                  </Grid>
                                </TableCell>
                                <TableCell>
                                  <Grid xs={12}>
                                    <Grid xs={4}>
                                      { row.address }
                                    </Grid>
                                  </Grid>
                                </TableCell>
                                <TableCell>
                                  <Grid xs={12}>
                                    <Grid xs={12}>
                                      $ {row.order_value}
                                    </Grid>
                                    <Grid xs={12}>
                                      USD
                                    </Grid>
                                  </Grid>
                                </TableCell>
                              </TableRow>
                            )
                          }
                            )}

                      </TableBody>
                    </Table>
                    </TableContainer>
                      <TablePagination
                        style={{color: '#6E6893'}}
                        className="tfooter"
                        rowsPerPageOptions={[1, 2, 3]}
                        component="div"
                        count={this.newData().length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      />
                    </Paper>
                </div>
              </div>
            </div>
          </Grid>
      </Container>
    </React.Fragment>
      </>
    )
  }
}
