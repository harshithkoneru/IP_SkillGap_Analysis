
<%@ page import="java.sql.*" %>
<%@ include file="../WEB-INF/db.jsp" %>
<%
Statement st=conn.createStatement();
st.executeUpdate("DELETE FROM assessments");
conn.close();
out.print("cleared");
%>
