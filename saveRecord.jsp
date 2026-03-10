
<%@ page import="java.sql.*" %>
<%@ include file="../WEB-INF/db.jsp" %>
<%
String json=request.getParameter("json");

PreparedStatement ps=conn.prepareStatement("INSERT INTO assessments(data) VALUES(?)");
ps.setString(1,json);
ps.executeUpdate();

conn.close();
out.print("saved");
%>
