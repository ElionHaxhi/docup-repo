/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author elion
 */
@Entity
@Table(name = "patient")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Patient.findAll", query = "SELECT p FROM Patient p"),
    @NamedQuery(name = "Patient.findById", query = "SELECT p FROM Patient p WHERE p.id = :id"),
    @NamedQuery(name = "Patient.findByDate", query = "SELECT p FROM Patient p WHERE p.date = :date"),
    @NamedQuery(name = "Patient.findByTrash", query = "SELECT p FROM Patient p WHERE p.trash = :trash"),
    @NamedQuery(name = "Patient.findByTrashDate", query = "SELECT p FROM Patient p WHERE p.trashDate = :trashDate")})
public class Patient implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "date")
    @Temporal(TemporalType.DATE)
    private Date date;
    @Basic(optional = false)
    @Column(name = "trash")
    private boolean trash;
    @Column(name = "trash_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date trashDate;
    @ManyToMany(mappedBy = "patientList")
    private List<Doctor> doctorList;
    @JoinColumn(name = "picture_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Picture pictureId;
    @JoinColumn(name = "personal_info_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private PersonalInfo personalInfoId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "patientId")
    private List<Visit> visitList;

    public Patient() {
    }

    public Patient(Integer id) {
        this.id = id;
    }

    public Patient(Integer id, boolean trash) {
        this.id = id;
        this.trash = trash;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public boolean getTrash() {
        return trash;
    }

    public void setTrash(boolean trash) {
        this.trash = trash;
    }

    public Date getTrashDate() {
        return trashDate;
    }

    public void setTrashDate(Date trashDate) {
        this.trashDate = trashDate;
    }

    //@XmlTransient
    public List<Doctor> getDoctorList() {
        return doctorList;
    }

    public void setDoctorList(List<Doctor> doctorList) {
        this.doctorList = doctorList;
    }

    public Picture getPictureId() {
        return pictureId;
    }

    public void setPictureId(Picture pictureId) {
        this.pictureId = pictureId;
    }

    public PersonalInfo getPersonalInfoId() {
        return personalInfoId;
    }

    public void setPersonalInfoId(PersonalInfo personalInfoId) {
        this.personalInfoId = personalInfoId;
    }

    @XmlTransient
    public List<Visit> getVisitList() {
        return visitList;
    }

    public void setVisitList(List<Visit> visitList) {
        this.visitList = visitList;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Patient)) {
            return false;
        }
        Patient other = (Patient) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.docup.model.Patient[ id=" + id + " ]";
    }
    
}
