import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Support as SupportIcon, Reply } from '@mui/icons-material';
import Swal from 'sweetalert2';

const SupportManagement = () => {
  const [tickets, setTickets] = useState([
    { id: 1, customer: 'John Doe', email: 'john@example.com', subject: 'Order not received', status: 'Open', priority: 'High' },
    { id: 2, customer: 'Jane Smith', email: 'jane@example.com', subject: 'Product defect', status: 'In Progress', priority: 'Medium' },
    { id: 3, customer: 'Bob Johnson', email: 'bob@example.com', subject: 'Refund request', status: 'Resolved', priority: 'Low' }
  ]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [response, setResponse] = useState('');

  const handleRespond = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleSendResponse = () => {
    if (!response.trim()) {
      Swal.fire('Error', 'Please enter a response', 'error');
      return;
    }

    // Update ticket status
    setTickets(tickets.map(t =>
      t.id === selectedTicket.id ? { ...t, status: 'Resolved' } : t
    ));

    Swal.fire('Success!', 'Response sent to customer', 'success');
    setOpenDialog(false);
    setResponse('');
    setSelectedTicket(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'error',
      'In Progress': 'warning',
      'Resolved': 'success'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'error',
      'Medium': 'warning',
      'Low': 'info'
    };
    return colors[priority] || 'default';
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" className="mb-4">
        Support & Tickets
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Subject</strong></TableCell>
                  <TableCell><strong>Priority</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>#{ticket.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{ticket.customer}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.priority}
                        color={getPriorityColor(ticket.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status}
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Reply />}
                        onClick={() => handleRespond(ticket)}
                        disabled={ticket.status === 'Resolved'}
                      >
                        Respond
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Respond to Ticket</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box>
              <Typography variant="body2" className="mb-2">
                <strong>Customer:</strong> {selectedTicket.customer}
              </Typography>
              <Typography variant="body2" className="mb-3">
                <strong>Subject:</strong> {selectedTicket.subject}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSendResponse} variant="contained">Send Response</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupportManagement;
